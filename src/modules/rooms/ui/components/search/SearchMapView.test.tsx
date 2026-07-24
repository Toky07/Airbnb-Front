import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

vi.mock('leaflet/dist/images/marker-icon-2x.png', () => ({ default: 'marker-icon-2x.png' }));
vi.mock('leaflet/dist/images/marker-icon.png', () => ({ default: 'marker-icon.png' }));
vi.mock('leaflet/dist/images/marker-shadow.png', () => ({ default: 'marker-shadow.png' }));
vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn(() => ({})),
    latLngBounds: vi.fn(() => ({})),
    Marker: {
      prototype: {
        options: {},
      },
    },
  },
}));

import { sampleRoomApi } from '../../../../../test/fixtures/rooms-api.fixtures';
import SearchMapView from './SearchMapView';

describe('SearchMapView', () => {
  it('affiche la carte avec un marqueur par logement géolocalisé', () => {
    render(
      <MemoryRouter>
        <SearchMapView rooms={[sampleRoomApi]} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('search-map-view')).toBeInTheDocument();
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getAllByTestId('map-marker')).toHaveLength(1);
    expect(screen.getByRole('link', { name: /voir le logement/i })).toHaveAttribute(
      'href',
      `/rooms/${sampleRoomApi.slug}`,
    );
  });

  it('affiche un cercle de rayon quand la recherche est géolocalisée', () => {
    render(
      <MemoryRouter>
        <SearchMapView
          rooms={[sampleRoomApi]}
          center={{ lat: 43.7102, lng: 7.262 }}
          radiusKm={25}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('map-circle')).toHaveAttribute('data-radius', String(25_000));
  });
});
