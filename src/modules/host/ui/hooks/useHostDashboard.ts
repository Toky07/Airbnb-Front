import { useEffect, useState } from 'react';
import {
  getHostReservationService,
  getHostService,
} from '../../core/services/host.service';
import type {
  HostReservationActivity,
  HostReservationStats,
} from '../../core/types/host-booking.types';
import type { HostProfile } from '../../core/types/host.types';

export function useHostDashboard() {
  const [profile, setProfile] = useState<HostProfile | null>(null);
  const [roomsCount, setRoomsCount] = useState(0);
  const [reservationStats, setReservationStats] = useState<HostReservationStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<HostReservationActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const hostService = getHostService();
      const reservationService = getHostReservationService();
      const [profileData, statsOverview] = await Promise.all([
        hostService.getProfile(),
        reservationService.getStatsOverview(),
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
      setReservationStats(statsOverview.stats);
      setRecentActivity(statsOverview.recentActivity);
      setLoading(false);
    }

    void load();
  }, []);

  return { profile, roomsCount, reservationStats, recentActivity, loading };
}
