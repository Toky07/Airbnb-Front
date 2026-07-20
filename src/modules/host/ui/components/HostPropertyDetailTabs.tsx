import type { FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { PropertyFormPayload } from '../../core/types/host.types';
import type { CategorySummary, RoomListItem } from '../../../rooms/core/types/room.types';
import type { RoomFormPayload } from '../../core/types/host.types';
import { Button, PageSkeleton } from '../../../../shared/ui';
import HostFormError from './HostFormError';
import HostRoomsTable from './HostRoomsTable';
import PropertyForm from './PropertyForm';
import RoomForm from './RoomForm';

type HostPropertyRoomsTabProps = {
  rooms: RoomListItem[];
  roomsLoading: boolean;
  error: string | null;
  showForm: boolean;
  editingRoom: RoomListItem | null;
  roomForm: RoomFormPayload;
  roomTypes: CategorySummary[];
  existingImages: string[];
  newImagesValue: string[];
  roomFormError: string | null;
  roomSaving: boolean;
  roomAmenityIds: number[];
  onOpenCreate: () => void;
  onCloseForm: () => void;
  onSubmitRoom: (event: FormEvent) => void;
  onUpdateRoom: <K extends keyof RoomFormPayload>(key: K, value: RoomFormPayload[K]) => void;
  onRemoveExistingImage: (imagePath: string) => void;
  onRoomAmenityIdsChange: (ids: number[]) => void;
  onEditRoom: (room: RoomListItem) => void;
  onDeleteRoom: (room: RoomListItem) => void;
};

export function HostPropertyRoomsTab({
  rooms,
  roomsLoading,
  error,
  showForm,
  editingRoom,
  roomForm,
  roomTypes,
  existingImages,
  newImagesValue,
  roomFormError,
  roomSaving,
  roomAmenityIds,
  onOpenCreate,
  onCloseForm,
  onSubmitRoom,
  onUpdateRoom,
  onRemoveExistingImage,
  onRoomAmenityIdsChange,
  onEditRoom,
  onDeleteRoom,
}: HostPropertyRoomsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Chambres</h2>
          <p className="mt-1 text-sm text-slate-500">
            {rooms.length} chambre{rooms.length > 1 ? 's' : ''} publiée
            {rooms.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onOpenCreate} className="px-5 py-2.5">
          <FontAwesomeIcon icon="plus" className="mr-2 h-4 w-4" />
          Nouvelle chambre
        </Button>
      </div>

      {error && !showForm ? <HostFormError message={error} /> : null}

      {showForm ? (
        <RoomForm
          editingRoom={editingRoom}
          form={roomForm}
          roomTypes={roomTypes}
          existingImages={existingImages}
          newImagesValue={newImagesValue}
          error={roomFormError}
          saving={roomSaving}
          onClose={onCloseForm}
          onSubmit={onSubmitRoom}
          onUpdate={onUpdateRoom}
          onRemoveExistingImage={onRemoveExistingImage}
          amenityIds={roomAmenityIds}
          onAmenityIdsChange={onRoomAmenityIdsChange}
        />
      ) : null}

      {roomsLoading ? (
        <PageSkeleton className="h-48 rounded-2xl p-0" />
      ) : rooms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <FontAwesomeIcon icon="bed" className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-lg font-semibold text-slate-900">Aucune chambre</h3>
          <p className="mt-2 text-sm text-slate-500">
            Ajoutez votre première chambre pour la rendre visible aux voyageurs.
          </p>
          <Button onClick={onOpenCreate} className="mt-6 px-6 py-3">
            Créer une chambre
          </Button>
        </div>
      ) : (
        <HostRoomsTable rooms={rooms} onEdit={onEditRoom} onDelete={onDeleteRoom} />
      )}
    </div>
  );
}

type HostPropertyInfoTabProps = {
  form: PropertyFormPayload;
  types: CategorySummary[];
  imageValue: string;
  error: string | null;
  saving: boolean;
  amenityIds: number[];
  onSubmit: (event: FormEvent) => void;
  onImagePreviewChange: (value: string) => void;
  onImageFileSelect: (file: File | null) => void;
  onUpdate: <K extends keyof PropertyFormPayload>(key: K, value: PropertyFormPayload[K]) => void;
  onAmenityIdsChange: (ids: number[]) => void;
};

export function HostPropertyInfoTab({
  form,
  types,
  imageValue,
  error,
  saving,
  amenityIds,
  onSubmit,
  onImagePreviewChange,
  onImageFileSelect,
  onUpdate,
  onAmenityIdsChange,
}: HostPropertyInfoTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Informations de l’établissement</h2>
        <p className="mt-1 text-sm text-slate-500">
          Modifiez les détails visibles par les voyageurs et les équipements proposés.
        </p>
      </div>

      <PropertyForm
        propertyExists
        form={form}
        types={types}
        imageValue={imageValue}
        error={error}
        saving={saving}
        onSubmit={onSubmit}
        onImagePreviewChange={onImagePreviewChange}
        onImageFileSelect={onImageFileSelect}
        onUpdate={onUpdate}
        amenityIds={amenityIds}
        onAmenityIdsChange={onAmenityIdsChange}
      />
    </div>
  );
}
