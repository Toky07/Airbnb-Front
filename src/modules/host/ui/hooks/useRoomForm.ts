import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getListRoomAmenitiesUseCase,
  getSyncRoomAmenitiesUseCase,
} from '../../../amenity/application/composition/host-amenity.composition';
import {
  getCreateHostRoomUseCase,
  getUpdateHostRoomUseCase,
} from '../../application/room/composition/host-room.composition';
import type { RoomFormPayload } from '../../core/types/host.types';
import type { RoomListItem } from '../../../rooms/core/types/room.types';
import { notifyMessages, useNotification } from '../../../../shared/notifications';
import {
  EMPTY_IMAGE_VALUE,
  emptyRoomForm,
  roomToFormPayload,
} from '../constants/room-form.constants';

type UseRoomFormOptions = {
  propertyId: number;
  onSaved: () => Promise<void>;
};

export function useRoomForm({ propertyId, onSaved }: UseRoomFormOptions) {
  const createHostRoomUseCase = useMemo(() => getCreateHostRoomUseCase(), []);
  const updateHostRoomUseCase = useMemo(() => getUpdateHostRoomUseCase(), []);
  const listRoomAmenitiesUseCase = useMemo(() => getListRoomAmenitiesUseCase(), []);
  const syncRoomAmenitiesUseCase = useMemo(() => getSyncRoomAmenitiesUseCase(), []);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomListItem | null>(null);
  const [form, setForm] = useState<RoomFormPayload>(emptyRoomForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [amenityIds, setAmenityIds] = useState<number[]>([]);
  const { success: notifySuccess } = useNotification();
  const newImagesValue = useMemo(() => EMPTY_IMAGE_VALUE, []);

  const openCreate = useCallback(() => {
    setEditingRoom(null);
    setForm(emptyRoomForm);
    setAmenityIds([]);
    setError(null);
    setShowForm(true);
  }, []);

  const openEdit = useCallback((room: RoomListItem) => {
    setEditingRoom(room);
    setForm(roomToFormPayload(room));
    setAmenityIds([]);
    setError(null);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
  }, []);

  useEffect(() => {
    if (!showForm || !editingRoom) {
      return;
    }

    let cancelled = false;

    async function loadAmenities() {
      const assigned = await listRoomAmenitiesUseCase.execute(propertyId, editingRoom!.id);
      if (!cancelled) {
        setAmenityIds(assigned.success ? assigned.amenities.map((item) => item.id) : []);
      }
    }

    void loadAmenities();

    return () => {
      cancelled = true;
    };
  }, [showForm, editingRoom, propertyId, listRoomAmenitiesUseCase]);

  const update = useCallback(
    <K extends keyof RoomFormPayload>(key: K, value: RoomFormPayload[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const existingImages = useMemo(() => form.keptImagePaths ?? [], [form.keptImagePaths]);

  const removeExistingImage = useCallback(
    (imagePath: string) => {
      update(
        'keptImagePaths',
        existingImages.filter((path) => path !== imagePath),
      );
    },
    [existingImages, update],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setSaving(true);
      setError(null);

      const result = editingRoom
        ? await updateHostRoomUseCase.execute(propertyId, editingRoom.id, form)
        : await createHostRoomUseCase.execute(propertyId, form);

      setSaving(false);

      if (!result.success) {
        setError(result.error ?? 'Enregistrement impossible.');
        return;
      }

      const savedRoom = result.room;
      if (savedRoom) {
        const syncResult = await syncRoomAmenitiesUseCase.execute(
          propertyId,
          savedRoom.id,
          amenityIds,
        );
        if (!syncResult.success) {
          setError(
            syncResult.error ??
              'Chambre enregistrée, mais les équipements n’ont pas pu être mis à jour.',
          );
          return;
        }
      }

      setShowForm(false);
      notifySuccess(
        editingRoom
          ? notifyMessages.room.updated(form.name.trim())
          : notifyMessages.room.created(form.name.trim()),
      );
      await onSaved();
    },
    [
      amenityIds,
      createHostRoomUseCase,
      editingRoom,
      form,
      notifySuccess,
      onSaved,
      propertyId,
      syncRoomAmenitiesUseCase,
      updateHostRoomUseCase,
    ],
  );

  return {
    showForm,
    editingRoom,
    form,
    error,
    saving,
    newImagesValue,
    existingImages,
    openCreate,
    openEdit,
    closeForm,
    update,
    removeExistingImage,
    handleSubmit,
    amenityIds,
    setAmenityIds,
  };
}
