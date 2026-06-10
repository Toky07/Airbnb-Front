import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import HostFormError from '../components/HostFormError';
import HostRoomListItem from '../components/HostRoomListItem';
import HostRoomsEmptyState from '../components/HostRoomsEmptyState';
import RoomForm from '../components/RoomForm';
import { useHostRooms } from '../hooks/useHostRooms';
import { useRoomForm } from '../hooks/useRoomForm';

const HostRoomsPage = () => {
  usePageTitle('Mes chambres');
  const { rooms, roomTypes, loading, error, setError, loadRooms, deleteRoom } = useHostRooms();
  const {
    showForm,
    editingRoom,
    form,
    error: formError,
    saving,
    newImagesValue,
    existingImages,
    openCreate,
    openEdit,
    closeForm,
    update,
    removeExistingImage,
    handleSubmit,
  } = useRoomForm({ onSaved: loadRooms });

  const handleDelete = async (room: Parameters<typeof deleteRoom>[0]) => {
    setError(null);
    await deleteRoom(room);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl font-bold text-slate-900">Mes chambres</h1>
          <p className="mt-3 text-lg text-slate-500">Ajoutez, modifiez ou supprimez vos logements.</p>
        </div>
        <Button onClick={openCreate} className="px-6 py-3">
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
          Nouvelle chambre
        </Button>
      </div>

      {error && !showForm ? <HostFormError message={error} /> : null}

      {showForm ? (
        <RoomForm
          editingRoom={editingRoom}
          form={form}
          roomTypes={roomTypes}
          existingImages={existingImages}
          newImagesValue={newImagesValue}
          error={formError}
          saving={saving}
          onClose={closeForm}
          onSubmit={handleSubmit}
          onUpdate={update}
          onRemoveExistingImage={removeExistingImage}
        />
      ) : null}

      {loading ? (
        <div className="h-48 animate-pulse rounded-3xl bg-white p-8" />
      ) : rooms.length === 0 ? (
        <HostRoomsEmptyState />
      ) : (
        <div className="grid gap-4 divide-y divide-slate-100 rounded-3xl bg-white p-2 shadow-sm">
          {rooms.map((room) => (
            <HostRoomListItem
              key={room.id}
              room={room}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HostRoomsPage;
