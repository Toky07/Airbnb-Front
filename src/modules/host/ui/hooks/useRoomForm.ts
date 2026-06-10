import { type FormEvent, useCallback, useMemo, useState } from 'react';
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
  onSaved: () => Promise<void>;
};

export function useRoomForm({ onSaved }: UseRoomFormOptions) {
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomListItem | null>(null);
  const [form, setForm] = useState<RoomFormPayload>(emptyRoomForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { success: notifySuccess } = useNotification();
  const newImagesValue = useMemo(() => EMPTY_IMAGE_VALUE, []);

  const openCreate = useCallback(() => {
    setEditingRoom(null);
    setForm(emptyRoomForm);
    setError(null);
    setShowForm(true);
  }, []);

  const openEdit = useCallback((room: RoomListItem) => {
    setEditingRoom(room);
    setForm(roomToFormPayload(room));
    setError(null);
    setShowForm(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowForm(false);
  }, []);

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
        ? await hostService.updateRoom(editingRoom.id, form)
        : await hostService.createRoom(form);

      setSaving(false);

      if (!result.success) {
        setError(result.error ?? 'Enregistrement impossible.');
        return;
      }

      setShowForm(false);
      notifySuccess(
        editingRoom
          ? notifyMessages.room.updated(form.name.trim())
          : notifyMessages.room.created(form.name.trim()),
      );
      await onSaved();
    },
    [editingRoom, form, notifySuccess, onSaved],
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
  };
}
