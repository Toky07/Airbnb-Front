import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { getHostService } from '../../core/services/host.service';
import type { HostProperty, PropertyFormPayload } from '../../core/types/host.types';
import type { CategorySummary } from '../../../rooms/core/types/room.types';
import { resolveMediaUrl } from '../../../../shared/utils/resolve-media-url';
import { notifyMessages, useNotification } from '../../../../shared/notifications';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import {
  emptyPropertyForm,
  propertyToFormPayload,
} from '../constants/property-form.constants';

export function useHostPropertyForm() {
  const [property, setProperty] = useState<HostProperty | null>(null);
  const [types, setTypes] = useState<CategorySummary[]>([]);
  const [form, setForm] = useState<PropertyFormPayload>(emptyPropertyForm);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success: notifySuccess } = useNotification();
  const { refreshSession } = useAuth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const hostService = getHostService();
      const [propertyData, typeOptions] = await Promise.all([
        hostService.getProperty(),
        hostService.listPropertyTypeOptions(),
      ]);
      setProperty(propertyData);
      setTypes(typeOptions);

      if (propertyData) {
        setForm(propertyToFormPayload(propertyData));
        setImagePreview(propertyData.image ?? '');
      } else {
        setForm(emptyPropertyForm);
        setImagePreview('');
      }

      setLoading(false);
    }

    void load();
  }, []);

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
      const result = property
        ? await hostService.updateProperty(form)
        : await hostService.createProperty(form);

      setSaving(false);

      if (!result.success) {
        setError(result.error ?? 'Enregistrement impossible.');
        return;
      }

      setProperty(result.property ?? null);
      await refreshSession();
      notifySuccess(
        property
          ? notifyMessages.property.updated(form.name.trim())
          : notifyMessages.property.created(form.name.trim()),
      );
    },
    [form, notifySuccess, property, refreshSession],
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
  };
}
