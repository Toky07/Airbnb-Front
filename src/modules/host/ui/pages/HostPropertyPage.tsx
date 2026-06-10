import { type FormEvent, useEffect, useState } from 'react';
import { getHostService } from '../../core/services/host.service';
import type { HostProperty, PropertyFormPayload } from '../../core/types/host.types';
import type { CategorySummary } from '../../../rooms/core/types/room.types';
import { resolveMediaUrl } from '../../../../shared/utils/resolve-media-url';
import { Button } from '../../../../shared/ui';
import { notifyMessages, useNotification } from '../../../../shared/notifications';
import { useAuth } from '../../../auth/ui/hooks/useAuth';

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
    await refreshSession();
    notifySuccess(
      property
        ? notifyMessages.property.updated(form.name.trim())
        : notifyMessages.property.created(form.name.trim()),
    );
  };

  if (loading) {
    return <div className="h-96 animate-pulse rounded-3xl border border-slate-100 bg-white p-8 shadow-sm" />;
  }

  const imagePreview = form.imageFile
    ? URL.createObjectURL(form.imageFile)
    : resolveMediaUrl(property?.image);

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="font-serif text-4xl font-bold text-slate-900">Mon établissement</h1>
        <p className="mt-3 text-lg text-slate-500">
          {property ? 'Modifiez les informations visibles par les voyageurs.' : 'Créez votre hôtel ou établissement.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="p-8 sm:p-10">
          {error ? (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : null}

          <div className="grid gap-8 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Nom de l'établissement</span>
              <input
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
                placeholder="Ex: Hôtel Riviera"
              />
            </label>
            
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => update('description', event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                placeholder="Décrivez votre établissement..."
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Adresse</span>
              <input
                value={form.address}
                onChange={(event) => update('address', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Ville</span>
              <input
                value={form.city}
                onChange={(event) => update('city', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Pays</span>
              <input
                value={form.country}
                onChange={(event) => update('country', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Type d'établissement</span>
              <select
                value={form.propertyTypeId ?? ''}
                onChange={(event) =>
                  update('propertyTypeId', event.target.value ? Number(event.target.value) : null)
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="">Sélectionner un type</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Heure d'arrivée</span>
              <input
                type="time"
                value={form.checkInTime}
                onChange={(event) => update('checkInTime', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Heure de départ</span>
              <input
                type="time"
                value={form.checkOutTime}
                onChange={(event) => update('checkOutTime', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base text-slate-900 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-slate-500">Photo principale</span>
              <div className="relative mt-2 flex justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-10 transition hover:border-brand hover:bg-slate-50">
                <div className="text-center">
                  <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-brand focus-within:outline-none focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 hover:text-brand/80"
                    >
                      <span>Télécharger un fichier</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(event) => update('imageFile', event.target.files?.[0] ?? null)}
                      />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF jusqu'à 10MB</p>
                </div>
              </div>
              {imagePreview ? (
                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
                  <img src={imagePreview} alt="Aperçu" className="h-64 w-full object-cover" />
                </div>
              ) : null}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-8 py-6 sm:px-10">
          <Button type="submit" disabled={saving} className="px-8 py-4 text-base">
            {saving ? 'Enregistrement…' : property ? 'Enregistrer les modifications' : 'Créer l’établissement'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default HostPropertyPage;
