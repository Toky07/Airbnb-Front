import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { sampleRoomApi } from '../../../../test/fixtures/rooms-api.fixtures';
import { renderWithRoute } from '../../../../test/render-with-providers';
import SearchPage from './SearchPage';

vi.mock('../components/search/SearchMapView', () => ({
  default: () => <div data-testid="search-map-view">Carte</div>,
}));

describe('SearchPage (integration)', () => {
  it('affiche les résultats via GET /rooms', async () => {
    await renderWithRoute('/search', <SearchPage />, { routerInitialEntries: ['/search'] });

    await waitFor(() => {
      expect(screen.getByText(sampleRoomApi.name)).toBeInTheDocument();
    });
  });

  it('filtre les résultats selon le paramètre de recherche', async () => {
    await renderWithRoute('/search', <SearchPage />, {
      routerInitialEntries: ['/search?q=Nice'],
    });

    await waitFor(() => {
      expect(screen.getByText(sampleRoomApi.name)).toBeInTheDocument();
    });
  });

  it('propage les dates de séjour dans la barre de recherche', async () => {
    await renderWithRoute('/search', <SearchPage />, {
      routerInitialEntries: ['/search?checkIn=2026-08-01&checkOut=2026-08-05'],
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('2026-08-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2026-08-05')).toBeInTheDocument();
    });
  });

  it('affiche la carte en mode split quand lat/lng sont présents', async () => {
    await renderWithRoute('/search', <SearchPage />, {
      routerInitialEntries: ['/search?lat=43.7102&lng=7.262&radiusKm=25'],
    });

    await waitFor(() => {
      expect(screen.getByText(sampleRoomApi.name)).toBeInTheDocument();
    });

    expect(screen.getByTestId('search-map-view')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /liste \+ carte/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('permet de basculer vers la vue carte', async () => {
    await renderWithRoute('/search', <SearchPage />, {
      routerInitialEntries: ['/search'],
    });

    await waitFor(() => {
      expect(screen.getByText(sampleRoomApi.name)).toBeInTheDocument();
    });

    await fireEvent.click(screen.getByRole('button', { name: /^carte$/i }));

    expect(screen.getByTestId('search-map-view')).toBeInTheDocument();
    expect(screen.queryByText(sampleRoomApi.name)).not.toBeInTheDocument();
  });
});
