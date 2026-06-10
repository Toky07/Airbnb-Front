import { useEffect, useState } from 'react';
import { getHostReservationService, getHostService, type HostReservationStats } from '../../core/services/host.service';
import type { HostProfile } from '../../core/types/host.types';

export function useHostDashboard() {
  const [profile, setProfile] = useState<HostProfile | null>(null);
  const [roomsCount, setRoomsCount] = useState(0);
  const [reservationStats, setReservationStats] = useState<HostReservationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const hostService = getHostService();
      const reservationService = getHostReservationService();
      const [profileData, roomsData, statsData] = await Promise.all([
        hostService.getProfile(),
        hostService.listRooms({ page: 1, limit: 10 }),
        reservationService.getStats(),
      ]);
      setProfile(profileData);
      setRoomsCount(roomsData.meta.total);
      setReservationStats(statsData);
      setLoading(false);
    }

    void load();
  }, []);

  return { profile, roomsCount, reservationStats, loading };
}
