import { useEffect, useMemo, useState } from 'react';
import { getGetHostProfileUseCase } from '../../application/property/composition/host-property.composition';
import { getGetHostReservationStatsOverviewUseCase } from '../../application/reservation/composition/host-reservation.composition';
import { getListHostRoomsUseCase } from '../../application/room/composition/host-room.composition';
import type {
  HostReservationActivity,
  HostReservationStats,
} from '../../core/types/host-booking.types';
import type { HostProfile } from '../../core/types/host.types';

export function useHostDashboard() {
  const getHostProfileUseCase = useMemo(() => getGetHostProfileUseCase(), []);
  const getHostReservationStatsOverviewUseCase = useMemo(
    () => getGetHostReservationStatsOverviewUseCase(),
    [],
  );
  const listHostRoomsUseCase = useMemo(() => getListHostRoomsUseCase(), []);
  const [profile, setProfile] = useState<HostProfile | null>(null);
  const [roomsCount, setRoomsCount] = useState(0);
  const [reservationStats, setReservationStats] = useState<HostReservationStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<HostReservationActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [profileData, statsOverview] = await Promise.all([
        getHostProfileUseCase.execute(),
        getHostReservationStatsOverviewUseCase.execute(),
      ]);

      const properties = profileData?.properties ?? [];
      let totalRooms = 0;

      if (properties.length > 0) {
        const roomResults = await Promise.all(
          properties.map((property) =>
            listHostRoomsUseCase.execute(property.id, { page: 1, limit: 10 }),
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
  }, [getHostProfileUseCase, getHostReservationStatsOverviewUseCase, listHostRoomsUseCase]);

  return { profile, roomsCount, reservationStats, recentActivity, loading };
}
