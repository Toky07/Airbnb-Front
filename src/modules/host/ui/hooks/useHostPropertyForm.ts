import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { getHostAmenityService } from '../../../amenity/core/services/host-amenity.service';
import { getHostService } from '../../core/services/host.service';
import type { HostProperty, PropertyFormPayload } from '../../core/types/host.types';
import type { CategorySummary } from '../../../rooms/core/types/room.types';
import { resolveMediaUrl } from '../../../../shared/utils/resolve-media-url';
import { notifyMessages, useNotification } from '../../../../shared/notifications';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import { useHostPropertyContext } from '../context/host-property.context';
import {
  emptyPropertyForm,
  propertyToFormPayload,
} from '../constants/property-form.constants';

type PropertyFormMode = 'create' | 'edit';

export function useHostPropertyForm(mode: PropertyFormMode, propertyId: number | null) {
  const [property, setProperty] = useState<HostProperty | null>(null);
  const [types, setTypes] = useState<CategorySummary[]>([]);
  const [form, setForm] = useState<PropertyFormPayload>(emptyPropertyForm);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amenityIds, setAmenityIds] = useState<number[]>([]);
  const { success: notifySuccess } = useNotification();
  const { refreshSession } = useAuth();
  const { refreshProperties } = useHostPropertyContext();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const hostService = getHostService();
      const typeOptions = await hostService.listPropertyTypeOptions();
      setTypes(typeOptions);

      if (mode === 'edit' && propertyId) {
        const propertyData = await hostService.getProperty(propertyId);
        setProperty(propertyData);

        if (propertyData) {
          setForm(propertyToFormPayload(propertyData));
          setImagePreview(propertyData.image ?? '');
          try {
            const assigned = await getHostAmenityService().listForProperty(propertyData.id);
            setAmenityIds(assigned.map((item) => item.id));
          } catch {
            setAmenityIds([]);
          }
        } else {
          setForm(emptyPropertyForm);
          setImagePreview('');
          setAmenityIds([]);
        }
      } else {
        setProperty(null);
        setForm(emptyPropertyForm);
        setImagePreview('');
        setAmenityIds([]);
      }

      setLoading(false);
    }

    void load();
  }, [mode, propertyId]);

  const update = useCallback(
    <K extends keyof PropertyFormPayload>(key: K, value: PropertyFormPayload[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setSaving(true);
      setError(null);

      const hostService = getHostService();
      const result =
        mode === 'edit' && propertyId
          ? await hostService.updateProperty(propertyId, form)
          : await hostService.createProperty(form);

      setSaving(false);

      if (!result.success) {
        setError(result.error ?? 'Enregistrement impossible.');
        return;
      }

      const savedProperty = result.property ?? null;

      if (savedProperty) {
        try {
          await getHostAmenityService().syncForProperty(savedProperty.id, amenityIds);
        } catch (syncError) {
          setError(
            syncError instanceof Error
              ? syncError.message
              : 'Établissement enregistré, mais les équipements n’ont pas pu être mis à jour.',
          );
          return;
        }
      }

      await refreshProperties();
      await refreshSession();
      notifySuccess(
        mode === 'edit'
          ? notifyMessages.property.updated(form.name.trim())
          : notifyMessages.property.created(form.name.trim()),
      );

      return savedProperty;
    },
    [
      amenityIds,
      form,
      mode,
      notifySuccess,
      propertyId,
      refreshProperties,
      refreshSession,
    ],
  );

  const imageValue = imagePreview || resolveMediaUrl(property?.image) || '';

  return {
    property,
    types,
    form,
    imagePreview,
    imageValue,
    loading,
    saving,
    error,
    setImagePreview,
    update,
    handleSubmit,
    amenityIds,
    setAmenityIds,
  };
}
