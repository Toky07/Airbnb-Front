import type { FormEvent } from 'react';
import type { PropertyFormPayload } from '../../core/types/host.types';
import type { CategorySummary } from '../../../rooms/core/types/room.types';
import { Button, ImageFileInput } from '../../../../shared/ui';
import { hostFieldClassName } from '../constants/host-form-classes';
import HostFormError from './HostFormError';
import HostFormField from './HostFormField';

type PropertyFormProps = {
  propertyExists: boolean;
  form: PropertyFormPayload;
  types: CategorySummary[];
  imageValue: string;
  error: string | null;
  saving: boolean;
  onSubmit: (event: FormEvent) => void;
  onImagePreviewChange: (value: string) => void;
  onImageFileSelect: (file: File | null) => void;
  onUpdate: <K extends keyof PropertyFormPayload>(key: K, value: PropertyFormPayload[K]) => void;
};

const PropertyForm = ({
  propertyExists,
  form,
  types,
  imageValue,
  error,
  saving,
  onSubmit,
  onImagePreviewChange,
  onImageFileSelect,
  onUpdate,
}: PropertyFormProps) => (
  <form onSubmit={onSubmit} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
    <div className="p-8 sm:p-10">
      {error ? <HostFormError message={error} className="mb-8" /> : null}

      <div className="grid gap-8 md:grid-cols-2">
        <HostFormField label="Nom de l'établissement" fullWidth>
          <input
            value={form.name}
            onChange={(event) => onUpdate('name', event.target.value)}
            className={hostFieldClassName}
            required
            placeholder="Ex: Hôtel Riviera"
          />
        </HostFormField>

        <HostFormField label="Description" fullWidth>
          <textarea
            value={form.description}
            onChange={(event) => onUpdate('description', event.target.value)}
            rows={4}
            className={hostFieldClassName}
            placeholder="Décrivez votre établissement..."
          />
        </HostFormField>

        <HostFormField label="Adresse" fullWidth>
          <input
            value={form.address}
            onChange={(event) => onUpdate('address', event.target.value)}
            className={hostFieldClassName}
            required
          />
        </HostFormField>

        <HostFormField label="Ville">
          <input
            value={form.city}
            onChange={(event) => onUpdate('city', event.target.value)}
            className={hostFieldClassName}
            required
          />
        </HostFormField>

        <HostFormField label="Pays">
          <input
            value={form.country}
            onChange={(event) => onUpdate('country', event.target.value)}
            className={hostFieldClassName}
            required
          />
        </HostFormField>

        <HostFormField label="Type d'établissement" fullWidth>
          <select
            value={form.propertyTypeId ?? ''}
            onChange={(event) =>
              onUpdate('propertyTypeId', event.target.value ? Number(event.target.value) : null)
            }
            className={hostFieldClassName}
          >
            <option value="">Sélectionner un type</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </HostFormField>

        <HostFormField label="Heure d'arrivée">
          <input
            type="time"
            value={form.checkInTime}
            onChange={(event) => onUpdate('checkInTime', event.target.value)}
            className={hostFieldClassName}
          />
        </HostFormField>

        <HostFormField label="Heure de départ">
          <input
            type="time"
            value={form.checkOutTime}
            onChange={(event) => onUpdate('checkOutTime', event.target.value)}
            className={hostFieldClassName}
          />
        </HostFormField>

        <div className="md:col-span-2">
          <ImageFileInput
            label="Photo principale"
            value={imageValue}
            fallbackInitials={form.name.slice(0, 2).toUpperCase() || 'HT'}
            onChange={onImagePreviewChange}
            onFileSelect={onImageFileSelect}
          />
        </div>
      </div>
    </div>

    <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50 px-8 py-6 sm:px-10">
      <Button type="submit" disabled={saving} className="px-8 py-4 text-base">
        {saving
          ? 'Enregistrement…'
          : propertyExists
            ? 'Enregistrer les modifications'
            : 'Créer l’établissement'}
      </Button>
    </div>
  </form>
);

export default PropertyForm;
