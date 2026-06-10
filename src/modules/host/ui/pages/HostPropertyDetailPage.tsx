import { useMemo, useState, type FormEvent } from 'react';
import { faArrowLeft, faBed, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useParams } from 'react-router';
import { Button } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import HostFormError from '../components/HostFormError';
import HostRoomsTable from '../components/HostRoomsTable';
import PropertyForm from '../components/PropertyForm';
import RoomForm from '../components/RoomForm';
import { useHostPropertyForm } from '../hooks/useHostPropertyForm';
import { useHostRooms } from '../hooks/useHostRooms';
import { useRoomForm } from '../hooks/useRoomForm';

type DetailTab = 'rooms' | 'info';

const HostPropertyDetailPage = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  const validPropertyId = Number.isFinite(propertyId) && propertyId > 0 ? propertyId : null;
  const [activeTab, setActiveTab] = useState<DetailTab>('rooms');

  const {
    property,
    types,
    form,
    imageValue,
    loading: propertyLoading,
    saving: propertySaving,
    error: propertyError,
    setImagePreview,
    update: updateProperty,
    handleSubmit: submitProperty,
    amenityIds: propertyAmenityIds,
    setAmenityIds: setPropertyAmenityIds,
  } = useHostPropertyForm('edit', validPropertyId);

  const { rooms, roomTypes, loading: roomsLoading, error, setError, loadRooms, deleteRoom } =
    useHostRooms(validPropertyId);

  const {
    showForm,
    editingRoom,
    form: roomForm,
    error: roomFormError,
    saving: roomSaving,
    newImagesValue,
    existingImages,
    openCreate,
    openEdit,
    closeForm,
    update: updateRoom,
    removeExistingImage,
    handleSubmit: submitRoom,
    amenityIds: roomAmenityIds,
    setAmenityIds: setRoomAmenityIds,
  } = useRoomForm({
    propertyId: validPropertyId ?? 0,
    onSaved: loadRooms,
  });

  usePageTitle(property?.name ?? 'Établissement');

  const locationLabel = useMemo(() => {
    if (!property) {
      return '';
    }
    return [property.city, property.country].filter(Boolean).join(', ');
  }, [property]);

  const handlePropertySubmit = async (event: FormEvent) => {
    event.preventDefault();
    await submitProperty(event);
  };

  const handleDeleteRoom = async (room: Parameters<typeof deleteRoom>[0]) => {
    setError(null);
    await deleteRoom(room);
  };

  if (!validPropertyId) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
        <p className="text-lg font-medium text-red-700">Établissement introuvable.</p>
        <Link to="/host/property" className="mt-4 inline-block text-sm font-semibold text-brand">
          Retour à la liste
        </Link>
      </div>
    );
  }

  if (propertyLoading) {
    return (
      <div className="h-96 animate-pulse rounded-3xl border border-slate-100 bg-white p-8 shadow-sm" />
    );
  }

  if (!property) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
        <p className="text-lg font-medium text-red-700">Établissement introuvable.</p>
        <Link to="/host/property" className="mt-4 inline-block text-sm font-semibold text-brand">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Link
        to="/host/property"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
        Retour à mes établissements
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl font-bold text-slate-900">{property.name}</h1>
          <p className="mt-2 text-lg text-slate-500">
            {locationLabel || property.address || 'Localisation non renseignée'}
            {' · '}
            {property.roomCount} chambre{property.roomCount > 1 ? 's' : ''}
          </p>
        </div>

        <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('rooms')}
            className={[
              'rounded-xl px-5 py-2.5 text-sm font-semibold transition',
              activeTab === 'rooms'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            Chambres
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={[
              'rounded-xl px-5 py-2.5 text-sm font-semibold transition',
              activeTab === 'info'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-50',
            ].join(' ')}
          >
            Informations
          </button>
        </div>
      </div>

      {activeTab === 'rooms' ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Chambres</h2>
              <p className="mt-1 text-sm text-slate-500">
                {rooms.length} chambre{rooms.length > 1 ? 's' : ''} publiée
                {rooms.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button onClick={openCreate} className="px-5 py-2.5">
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
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
              onClose={closeForm}
              onSubmit={submitRoom}
              onUpdate={updateRoom}
              onRemoveExistingImage={removeExistingImage}
              amenityIds={roomAmenityIds}
              onAmenityIdsChange={setRoomAmenityIds}
            />
          ) : null}

          {roomsLoading ? (
            <div className="h-48 animate-pulse rounded-2xl bg-white" />
          ) : rooms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FontAwesomeIcon icon={faBed} className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">Aucune chambre</h3>
              <p className="mt-2 text-sm text-slate-500">
                Ajoutez votre première chambre pour la rendre visible aux voyageurs.
              </p>
              <Button onClick={openCreate} className="mt-6 px-6 py-3">
                Créer une chambre
              </Button>
            </div>
          ) : (
            <HostRoomsTable
              rooms={rooms}
              onEdit={openEdit}
              onDelete={handleDeleteRoom}
            />
          )}
        </div>
      ) : (
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
            error={propertyError}
            saving={propertySaving}
            onSubmit={handlePropertySubmit}
            onImagePreviewChange={setImagePreview}
            onImageFileSelect={(file) => updateProperty('imageFile', file)}
            onUpdate={updateProperty}
            amenityIds={propertyAmenityIds}
            onAmenityIdsChange={setPropertyAmenityIds}
          />
        </div>
      )}
    </div>
  );
};

export default HostPropertyDetailPage;
