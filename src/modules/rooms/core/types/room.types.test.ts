import { describe, expect, it } from 'vitest';
import { sampleRoomApi } from '../../../../test/fixtures/rooms-api.fixtures';
import { getRoomCoordinates } from './room.types';

describe('getRoomCoordinates', () => {
  it('retourne les coordonnées de la propriété', () => {
    expect(getRoomCoordinates(sampleRoomApi)).toEqual({
      lat: 43.7102,
      lng: 7.262,
    });
  });

  it('retourne null sans coordonnées', () => {
    expect(
      getRoomCoordinates({
        ...sampleRoomApi,
        property: sampleRoomApi.property
          ? { ...sampleRoomApi.property, latitude: undefined, longitude: undefined }
          : null,
      }),
    ).toBeNull();
  });

  it('retourne null pour des coordonnées nulles', () => {
    expect(
      getRoomCoordinates({
        ...sampleRoomApi,
        property: sampleRoomApi.property
          ? { ...sampleRoomApi.property, latitude: 0, longitude: 0 }
          : null,
      }),
    ).toBeNull();
  });
});
