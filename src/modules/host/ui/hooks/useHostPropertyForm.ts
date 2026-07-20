import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getListPropertyAmenitiesUseCase,
  getSyncPropertyAmenitiesUseCase,
} from '../../../amenity/application/composition/host-amenity.composition';
import {
  getCreateHostPropertyUseCase,
  getGetHostPropertyUseCase,
  getUpdateHostPropertyUseCase,
} from '../../application/property/composition/host-property.composition';
import { getListHostPropertyTypeOptionsUseCase } from '../../application/room/composition/host-room.composition';
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
  const getHostPropertyUseCase = useMemo(() => getGetHostPropertyUseCase(), []);
  const createHostPropertyUseCase = useMemo(() => getCreateHostPropertyUseCase(), []);
  const updateHostPropertyUseCase = useMemo(() => getUpdateHostPropertyUseCase(), []);
  const listHostPropertyTypeOptionsUseCase = useMemo(
    () => getListHostPropertyTypeOptionsUseCase(),
    [],
  );
  const listPropertyAmenitiesUseCase = useMemo(() => getListPropertyAmenitiesUseCase(), []);
  const syncPropertyAmenitiesUseCase = useMemo(() => getSyncPropertyAmenitiesUseCase(), []);
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
      const typeOptions = await listHostPropertyTypeOptionsUseCase.execute();
      setTypes(typeOptions);

      if (mode === 'edit' && propertyId) {
        const propertyData = await getHostPropertyUseCase.execute(propertyId);
        setProperty(propertyData);

        if (propertyData) {
          setForm(propertyToFormPayload(propertyData));
          setImagePreview(propertyData.image ?? '');
          const assigned = await listPropertyAmenitiesUseCase.execute(propertyData.id);
          setAmenityIds(assigned.success ? assigned.amenities.map((item) => item.id) : []);
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
  }, [getHostPropertyUseCase, listHostPropertyTypeOptionsUseCase, listPropertyAmenitiesUseCase, mode, propertyId]);

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

      const result =
        mode === 'edit' && propertyId
          ? await updateHostPropertyUseCase.execute(propertyId, form)
          : await createHostPropertyUseCase.execute(form);

      setSaving(false);

      if (!result.success) {
        setError(result.error ?? 'Enregistrement impossible.');
        return;
      }

      const savedProperty = result.property ?? null;

      if (savedProperty) {
        const syncResult = await syncPropertyAmenitiesUseCase.execute(savedProperty.id, amenityIds);
        if (!syncResult.success) {
          setError(
            syncResult.error ??
              'Établissement enregistré, mais les équipements n’ont pas pu être mis à jour.',
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
      createHostPropertyUseCase,
      syncPropertyAmenitiesUseCase,
      form,
      mode,
      notifySuccess,
      propertyId,
      refreshProperties,
      refreshSession,
      updateHostPropertyUseCase,
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
