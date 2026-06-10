import type { FormEvent } from 'react';
import type { RoomFormPayload } from '../../core/types/host.types';
import type { CategorySummary } from '../../../rooms/core/types/room.types';
import type { RoomListItem } from '../../../rooms/core/types/room.types';
import { Button, ImageFileInput, ImageGallery } from '../../../../shared/ui';
import { hostFieldClassName } from '../constants/host-form-classes';
import { ROOM_MAX_IMAGES, ROOM_STATUS_OPTIONS } from '../constants/room-form.constants';
import HostFormError from './HostFormError';
import HostFormField from './HostFormField';

type RoomFormProps = {
  editingRoom: RoomListItem | null;
  form: RoomFormPayload;
  roomTypes: CategorySummary[];
  existingImages: string[];
  newImagesValue: string[];
  error: string | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  onUpdate: <K extends keyof RoomFormPayload>(key: K, value: RoomFormPayload[K]) => void;
  onRemoveExistingImage: (imagePath: string) => void;
};

const RoomForm = ({
  editingRoom,
  form,
  roomTypes,
  existingImages,
  newImagesValue,
  error,
  saving,
  onClose,
  onSubmit,
  onUpdate,
  onRemoveExistingImage,
}: RoomFormProps) => (
  <form onSubmit={onSubmit} className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
    <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6 sm:px-10">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-slate-900">
          {editingRoom ? 'Modifier la chambre' : 'Nouvelle chambre'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
        >
          Fermer
        </button>
      </div>
    </div>

    <div className="p-8 sm:p-10">
      {error ? <HostFormError message={error} className="mb-8" /> : null}

      <div className="grid gap-8 md:grid-cols-2">
        <HostFormField label="Nom de la chambre" fullWidth>
          <input
            value={form.name}
            onChange={(event) => onUpdate('name', event.target.value)}
            className={hostFieldClassName}
            required
            placeholder="Ex: Suite Vue Mer"
          />
        </HostFormField>

        <HostFormField label="Description" fullWidth>
          <textarea
            value={form.description}
            onChange={(event) => onUpdate('description', event.target.value)}
            rows={3}
            className={hostFieldClassName}
            placeholder="Décrivez les atouts de cette chambre..."
          />
        </HostFormField>

        <HostFormField label="Prix / nuit (€)">
          <input
            type="number"
            min={1}
            value={form.pricePerNight}
            onChange={(event) => onUpdate('pricePerNight', Number(event.target.value))}
            className={hostFieldClassName}
            required
          />
        </HostFormField>

        <HostFormField label="Statut">
          <select
            value={form.status}
            onChange={(event) => onUpdate('status', event.target.value)}
            className={hostFieldClassName}
          >
            {ROOM_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </HostFormField>

        <HostFormField label="Type">
          <select
            value={form.roomTypeId ?? ''}
            onChange={(event) =>
              onUpdate('roomTypeId', event.target.value ? Number(event.target.value) : null)
            }
            className={hostFieldClassName}
          >
            <option value="">Sélectionner</option>
            {roomTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </HostFormField>

        <HostFormField label="Voyageurs max">
          <input
            type="number"
            min={1}
            value={form.maxGuests}
            onChange={(event) => onUpdate('maxGuests', Number(event.target.value))}
            className={hostFieldClassName}
          />
        </HostFormField>

        <div className="grid grid-cols-3 gap-4 md:col-span-2">
          <HostFormField label="Chambres">
            <input
              type="number"
              min={0}
              value={form.bedrooms}
              onChange={(event) => onUpdate('bedrooms', Number(event.target.value))}
              className={hostFieldClassName}
            />
          </HostFormField>
          <HostFormField label="Lits">
            <input
              type="number"
              min={0}
              value={form.beds}
              onChange={(event) => onUpdate('beds', Number(event.target.value))}
              className={hostFieldClassName}
            />
          </HostFormField>
          <HostFormField label="Surface (m²)">
            <input
              type="number"
              min={1}
              value={form.size}
              onChange={(event) => onUpdate('size', Number(event.target.value))}
              className={hostFieldClassName}
            />
          </HostFormField>
        </div>

        <div className="space-y-6 md:col-span-2">
          {editingRoom ? (
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                Photos actuelles
              </p>
              {existingImages.length > 0 ? (
                <ImageGallery
                  images={existingImages}
                  alt={form.name || 'Chambre'}
                  onRemove={onRemoveExistingImage}
                />
              ) : (
                <p className="text-sm text-slate-500">Aucune photo enregistrée.</p>
              )}
            </div>
          ) : null}
          <ImageFileInput
            label={editingRoom ? 'Ajouter des photos' : 'Photos de la chambre'}
            multiple
            maxFiles={Math.max(0, ROOM_MAX_IMAGES - existingImages.length)}
            value={newImagesValue}
            onChange={() => {}}
            onFilesSelect={(files) => onUpdate('imageFiles', files)}
            hint={`JPG, PNG, WebP ou GIF — max. 5 Mo — jusqu'à ${ROOM_MAX_IMAGES} images`}
          />
        </div>
      </div>
    </div>

    <div className="flex items-center justify-end gap-4 border-t border-slate-100 bg-slate-50 px-8 py-6 sm:px-10">
      <Button type="button" variant="secondary" onClick={onClose} className="px-6 py-3">
        Annuler
      </Button>
      <Button type="submit" disabled={saving} className="px-8 py-3">
        {saving ? 'Enregistrement…' : editingRoom ? 'Enregistrer' : 'Créer la chambre'}
      </Button>
    </div>
  </form>
);

export default RoomForm;
