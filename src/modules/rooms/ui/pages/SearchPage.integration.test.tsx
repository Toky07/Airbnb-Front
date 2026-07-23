import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { sampleRoomApi } from '../../../../test/fixtures/rooms-api.fixtures';
import { renderWithRoute } from '../../../../test/render-with-providers';
import SearchPage from './SearchPage';

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
});
