import { describe, expect, it } from 'vitest';
import {
  sampleReservationItemApi,
  sampleReservationOutputApi,
} from '../../../../test/fixtures/reservation-api.fixtures';
import {
  mapFirstReservation,
  mapReservationOutput,
  mapReservationOutputs,
} from './map-reservation-output';

describe('mapReservationOutput', () => {
  it('mappe un ReservationOutput API vers des réservations à plat', () => {
    const result = mapReservationOutput(sampleReservationOutputApi);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 12,
      itemId: 7,
      roomId: 3,
      userId: 5,
      status: 'confirmed',
      roomName: 'Suite Deluxe',
      imageUrl: 'uploads/1/room/3/photo.jpg',
      totalPrice: 200,
      nights: 2,
    });
  });

  it('retourne un tableau vide si la réponse est invalide', () => {
    expect(mapReservationOutput(null)).toEqual([]);
    expect(mapReservationOutput({ id: 1 })).toEqual([]);
  });

  it('aplatit plusieurs réservations paginées', () => {
    const result = mapReservationOutputs([
      sampleReservationOutputApi,
      {
        ...sampleReservationOutputApi,
        id: 13,
        items: [{ ...sampleReservationItemApi, id: 8, reservationId: 13, roomId: 4 }],
      },
    ]);

    expect(result).toHaveLength(2);
    expect(result.map((item) => item.id)).toEqual([12, 13]);
  });

  it('expose mapFirstReservation pour la création', () => {
    expect(mapFirstReservation(sampleReservationOutputApi)?.roomId).toBe(3);
  });
});
