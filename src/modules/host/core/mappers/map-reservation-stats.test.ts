import { describe, expect, it } from 'vitest';
import {
  mapReservationActivities,
  mapReservationStats,
  mapReservationStatsOverview,
} from './map-reservation-stats';

describe('mapReservationStats', () => {
  it('mappe les statistiques host depuis l’API', () => {
    expect(
      mapReservationStats({
        activeCount: 4,
        pendingCount: 2,
        monthlyRevenue: 1500.5,
        totalRevenue: 4200,
        totalCount: 10,
        occupancyRate: 68,
        recentActivity: [],
      }),
    ).toEqual({
      activeCount: 4,
      pendingCount: 2,
      monthlyRevenue: 1500.5,
      totalRevenue: 4200,
      totalCount: 10,
      occupancyRate: 68,
    });
  });
});

describe('mapReservationActivities', () => {
  it('mappe l’activité récente', () => {
    expect(
      mapReservationActivities({
        recentActivity: [
          {
            id: 1,
            label: 'Suite · Hôtel Azur',
            totalPrice: 240,
            createdAt: '2026-08-01T10:00:00.000Z',
          },
        ],
      }),
    ).toEqual([
      {
        id: 1,
        label: 'Suite · Hôtel Azur',
        totalPrice: 240,
        createdAt: '2026-08-01T10:00:00.000Z',
      },
    ]);
  });
});

describe('mapReservationStatsOverview', () => {
  it('combine stats et activité récente', () => {
    expect(
      mapReservationStatsOverview({
        activeCount: 2,
        pendingCount: 1,
        monthlyRevenue: 500,
        totalRevenue: 1200,
        totalCount: 5,
        occupancyRate: 42,
        recentActivity: [
          {
            id: 3,
            label: 'Chambre double',
            totalPrice: 180,
            createdAt: '2026-08-02T08:00:00.000Z',
          },
        ],
      }),
    ).toEqual({
      stats: {
        activeCount: 2,
        pendingCount: 1,
        monthlyRevenue: 500,
        totalRevenue: 1200,
        totalCount: 5,
        occupancyRate: 42,
      },
      recentActivity: [
        {
          id: 3,
          label: 'Chambre double',
          totalPrice: 180,
          createdAt: '2026-08-02T08:00:00.000Z',
        },
      ],
    });
  });
});
