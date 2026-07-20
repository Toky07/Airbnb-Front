import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getDeleteHostRoomUseCase,
  getListHostRoomsUseCase,
  getListHostRoomTypeOptionsUseCase,
} from '../../application/room/composition/host-room.composition';
import type { CategorySummary, RoomListItem } from '../../../rooms/core/types/room.types';
import { notifyMessages, useNotification } from '../../../../shared/notifications';

export function useHostRooms(propertyId: number | null) {
  const listHostRoomsUseCase = useMemo(() => getListHostRoomsUseCase(), []);
  const listHostRoomTypeOptionsUseCase = useMemo(() => getListHostRoomTypeOptionsUseCase(), []);
  const deleteHostRoomUseCase = useMemo(() => getDeleteHostRoomUseCase(), []);
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [roomTypes, setRoomTypes] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success: notifySuccess } = useNotification();

  const loadRooms = useCallback(async () => {
    if (!propertyId) {
      setRooms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const [roomsData, types] = await Promise.all([
      listHostRoomsUseCase.execute(propertyId, { page: 1, limit: 25 }),
      listHostRoomTypeOptionsUseCase.execute(),
    ]);
    setRooms(roomsData.data);
    setRoomTypes(types);
    setLoading(false);
  }, [listHostRoomsUseCase, listHostRoomTypeOptionsUseCase, propertyId]);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  const deleteRoom = useCallback(
    async (room: RoomListItem) => {
      if (!propertyId) {
        setError('Établissement introuvable.');
        return;
      }

      if (!window.confirm(`Supprimer la chambre « ${room.name} » ?`)) {
        return;
      }

      const result = await deleteHostRoomUseCase.execute(propertyId, room.id);
      if (!result.success) {
        setError(result.error ?? 'Suppression impossible.');
        return;
      }

      notifySuccess(notifyMessages.room.deleted(room.name));
      await loadRooms();
    },
    [deleteHostRoomUseCase, loadRooms, notifySuccess, propertyId],
  );

  return {
    rooms,
    roomTypes,
    loading,
    error,
    setError,
    loadRooms,
    deleteRoom,
  };
}
