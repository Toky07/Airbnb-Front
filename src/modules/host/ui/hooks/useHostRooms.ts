import { useCallback, useEffect, useState } from 'react';
import { getHostService } from '../../core/services/host.service';
import type { CategorySummary, RoomListItem } from '../../../rooms/core/types/room.types';
import { notifyMessages, useNotification } from '../../../../shared/notifications';

export function useHostRooms() {
  const [rooms, setRooms] = useState<RoomListItem[]>([]);
  const [roomTypes, setRoomTypes] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success: notifySuccess } = useNotification();

  const loadRooms = useCallback(async () => {
    setLoading(true);
    const hostService = getHostService();
    const [roomsData, types] = await Promise.all([
      hostService.listRooms({ page: 1, limit: 25 }),
      hostService.listRoomTypeOptions(),
    ]);
    setRooms(roomsData.data);
    setRoomTypes(types);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadRooms();
  }, [loadRooms]);

  const deleteRoom = useCallback(
    async (room: RoomListItem) => {
      if (!window.confirm(`Supprimer la chambre « ${room.name} » ?`)) {
        return;
      }

      const result = await getHostService().deleteRoom(room.id);
      if (!result.success) {
        setError(result.error ?? 'Suppression impossible.');
        return;
      }

      notifySuccess(notifyMessages.room.deleted(room.name));
      await loadRooms();
    },
    [loadRooms, notifySuccess],
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
