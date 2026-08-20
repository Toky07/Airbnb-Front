import type { FormEvent } from 'react';
import type { PropertyFormPayload } from '../../core/types/host.types';
import type { CategorySummary } from '../../../rooms/core/types/room.types';
import HostAmenityField from '../../../amenity/ui/components/HostAmenityField';
import { Button, ImageFileInput } from '../../../../shared/ui';
import { hostFieldClassName } from '../constants/host-form-classes';
import HostFormError from './HostFormError';
import HostFormField from './HostFormField';
import { CANCELLATION_POLICY_OPTIONS } from '../../../reservation/core/constants/cancellation-policy.constants';

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
  amenityIds: number[];
  onAmenityIdsChange: (ids: number[]) => void;
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
  amenityIds,
  onAmenityIdsChange,
}: PropertyFormProps) => (
  <form onSubmit={onSubmit} className="overflow-hidden rounded-2xl border border-ink/8 bg-surface soft-shadow">
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

        <HostFormField label="Politique d'annulation" fullWidth>
          <select
            value={form.cancellationPolicy}
            onChange={(event) => onUpdate('cancellationPolicy', event.target.value)}
            className={hostFieldClassName}
          >
            {CANCELLATION_POLICY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-ink/50">
            Détermine le montant remboursé lors d&apos;une annulation par le voyageur.
          </p>
        </HostFormField>

        <HostFormField label="Taxe de séjour (€ / personne / nuit)" fullWidth>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.touristTaxPerGuestNight}
            onChange={(event) =>
              onUpdate('touristTaxPerGuestNight', Number.parseFloat(event.target.value) || 0)
            }
            className={hostFieldClassName}
          />
          <p className="mt-2 text-sm text-ink/50">
            Montant par voyageur et par nuit, ajouté au total lors du paiement.
          </p>
        </HostFormField>

        <HostFormField label="Règlement intérieur" fullWidth>
          <textarea
            value={form.houseRules}
            onChange={(event) => onUpdate('houseRules', event.target.value)}
            rows={3}
            className={hostFieldClassName}
            placeholder="Horaires de silence, fêtes, animaux…"
          />
        </HostFormField>

        <HostFormField label="Instructions d’arrivée" fullWidth>
          <textarea
            value={form.checkInInstructions}
            onChange={(event) => onUpdate('checkInInstructions', event.target.value)}
            rows={3}
            className={hostFieldClassName}
            placeholder="Boîte à clés, interphone, étage…"
          />
          <p className="mt-2 text-sm text-ink/50">
            Visible par le voyageur uniquement après un paiement confirmé.
          </p>
        </HostFormField>

        <HostFormField label="Nom du wifi">
          <input
            value={form.wifiName}
            onChange={(event) => onUpdate('wifiName', event.target.value)}
            className={hostFieldClassName}
            autoComplete="off"
          />
        </HostFormField>

        <HostFormField label="Mot de passe wifi">
          <input
            value={form.wifiPassword}
            onChange={(event) => onUpdate('wifiPassword', event.target.value)}
            className={hostFieldClassName}
            autoComplete="off"
          />
        </HostFormField>

        <HostFormField label="Contact d’urgence" fullWidth>
          <input
            value={form.emergencyContact}
            onChange={(event) => onUpdate('emergencyContact', event.target.value)}
            className={hostFieldClassName}
            placeholder="Téléphone ou email"
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

        {propertyExists ? (
          <HostAmenityField
            scope="property"
            label="Équipements de l’établissement"
            hint="Cochez les équipements proposés par votre établissement dans le catalogue."
            value={amenityIds}
            onChange={onAmenityIdsChange}
          />
        ) : null}
      </div>
    </div>

    <div className="flex items-center justify-end border-t border-ink/8 bg-mist/40 px-8 py-6 sm:px-10">
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
