import { useEffect, useState } from 'react';
import {
  getHostReservationService,
  getHostService,
  type HostReservationStats,
} from '../../core/services/host.service';
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
      const [profileData, statsData] = await Promise.all([
        hostService.getProfile(),
        reservationService.getStats(),
      ]);

      const properties = profileData?.properties ?? [];
      let totalRooms = 0;

      if (properties.length > 0) {
        const roomResults = await Promise.all(
          properties.map((property) =>
            hostService.listRooms(property.id, { page: 1, limit: 10 }),
          ),
        );
        totalRooms = roomResults.reduce((sum, result) => sum + result.meta.total, 0);
      }

      setProfile(profileData);
      setRoomsCount(totalRooms);
      setReservationStats(statsData);
      setLoading(false);
    }

    void load();
  }, []);

  return { profile, roomsCount, reservationStats, loading };
}
