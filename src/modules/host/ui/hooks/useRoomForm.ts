import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { getHostAmenityService } from '../../../amenity/core/services/host-amenity.service';
import { getHostService } from '../../core/services/host.service';
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
      try {
        const assigned = await getHostAmenityService().listForRoom(propertyId, editingRoom!.id);
        if (!cancelled) {
          setAmenityIds(assigned.map((item) => item.id));
        }
      } catch {
        if (!cancelled) {
          setAmenityIds([]);
        }
      }
    }

    void loadAmenities();

    return () => {
      cancelled = true;
    };
  }, [showForm, editingRoom, propertyId]);

  const update = useCallback(
    <K extends keyof RoomFormPayload>(key: K, value: RoomFormPayload[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const existingImages = form.keptImagePaths ?? [];

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

      const hostService = getHostService();
      const result = editingRoom
        ? await hostService.updateRoom(propertyId, editingRoom.id, form)
        : await hostService.createRoom(propertyId, form);

      setSaving(false);

      if (!result.success) {
        setError(result.error ?? 'Enregistrement impossible.');
        return;
      }

      const savedRoom = result.room;
      if (savedRoom) {
        try {
          await getHostAmenityService().syncForRoom(propertyId, savedRoom.id, amenityIds);
        } catch (syncError) {
          setError(
            syncError instanceof Error
              ? syncError.message
              : 'Chambre enregistrée, mais les équipements n’ont pas pu être mis à jour.',
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
    [amenityIds, editingRoom, form, notifySuccess, onSaved, propertyId],
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
