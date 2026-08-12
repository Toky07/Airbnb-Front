import type {
  HostReservationActivity,
  HostReservationStats,
  HostReservationStatsOverview,
} from '../types/host-booking.types';

export function mapReservationStats(data: unknown): HostReservationStats | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  return {
    activeCount: Number(record.activeCount ?? 0),
    pendingCount: Number(record.pendingCount ?? 0),
    monthlyRevenue: Number(record.monthlyRevenue ?? 0),
    totalRevenue: Number(record.totalRevenue ?? 0),
    totalCount: Number(record.totalCount ?? 0),
    occupancyRate: Number(record.occupancyRate ?? 0),
  };
}

export function mapReservationActivities(data: unknown): HostReservationActivity[] {
  if (!data || typeof data !== 'object') {
    return [];
  }

  const record = data as Record<string, unknown>;
  if (!Array.isArray(record.recentActivity)) {
    return [];
  }

  return record.recentActivity
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const activity = entry as Record<string, unknown>;
      if (typeof activity.id !== 'number' || typeof activity.label !== 'string') {
        return null;
      }

      return {
        id: activity.id,
        label: activity.label,
        totalPrice: Number(activity.totalPrice ?? 0),
        createdAt: String(activity.createdAt ?? ''),
      };
    })
    .filter((entry): entry is HostReservationActivity => entry !== null);
}

export function mapReservationStatsOverview(data: unknown): HostReservationStatsOverview {
  return {
    stats: mapReservationStats(data),
    recentActivity: mapReservationActivities(data),
  };
}
