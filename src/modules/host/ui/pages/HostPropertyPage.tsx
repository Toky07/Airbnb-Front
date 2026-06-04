import { type FormEvent, useEffect, useState } from 'react';
import { getHostService } from '../../core/services/host.service';
import type { HostProperty, PropertyFormPayload } from '../../core/types/host.types';
import type { CategorySummary } from '../../../rooms/core/types/room.types';
import { resolveMediaUrl } from '../../../../shared/utils/resolve-media-url';
import { Button } from '../../../../shared/ui';
import { notifyMessages, useNotification } from '../../../../shared/notifications';

const defaultForm: PropertyFormPayload = {
  name: '',
  description: '',
  address: '',
  city: '',
  country: 'France',
  latitude: 0,
  longitude: 0,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  propertyTypeId: null,
  imageFile: null,
};

const HostPropertyPage = () => {
  const [property, setProperty] = useState<HostProperty | null>(null);
  const [types, setTypes] = useState<CategorySummary[]>([]);
  const [form, setForm] = useState<PropertyFormPayload>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success: notifySuccess } = useNotification();

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
        setForm({
          name: propertyData.name,
          description: propertyData.description,
          address: propertyData.address,
          city: propertyData.city,
          country: propertyData.country,
          latitude: propertyData.latitude,
          longitude: propertyData.longitude,
          checkInTime: propertyData.checkInTime,
          checkOutTime: propertyData.checkOutTime,
          propertyTypeId: propertyData.propertyTypeId,
          imageFile: null,
        });
      }
      setLoading(false);
    }

    void load();
  }, []);

  const update = <K extends keyof PropertyFormPayload>(key: K, value: PropertyFormPayload[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
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
    notifySuccess(
      property
        ? notifyMessages.property.updated(form.name.trim())
        : notifyMessages.property.created(form.name.trim()),
    );
  };

  if (loading) {
    return <div className="animate-pulse rounded-3xl bg-white p-8 h-96 border border-slate-200" />;
  }

  const imagePreview = form.imageFile
    ? URL.createObjectURL(form.imageFile)
    : resolveMediaUrl(property?.image);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Mon établissement</h1>
        <p className="mt-2 text-slate-500">
          {property ? 'Modifiez les informations visibles par les voyageurs.' : 'Créez votre hôtel ou établissement.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Nom</span>
            <input
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </label>
          <label className="md:col-span-2 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => update('description', event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Adresse</span>
            <input
              value={form.address}
              onChange={(event) => update('address', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Ville</span>
            <input
              value={form.city}
              onChange={(event) => update('city', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Pays</span>
            <input
              value={form.country}
              onChange={(event) => update('country', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              required
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Type</span>
            <select
              value={form.propertyTypeId ?? ''}
              onChange={(event) =>
                update('propertyTypeId', event.target.value ? Number(event.target.value) : null)
              }
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="">Sélectionner</option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Arrivée</span>
            <input
              value={form.checkInTime}
              onChange={(event) => update('checkInTime', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Départ</span>
            <input
              value={form.checkOutTime}
              onChange={(event) => update('checkOutTime', event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>
          <label className="md:col-span-2 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Photo principale</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => update('imageFile', event.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm"
            />
            {imagePreview ? (
              <img src={imagePreview} alt="" className="mt-4 h-40 w-full rounded-2xl object-cover" />
            ) : null}
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Enregistrement…' : property ? 'Enregistrer' : 'Créer l’établissement'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HostPropertyPage;
