import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { sampleRoomApi } from '../../../../test/fixtures/rooms-api.fixtures';
import { renderWithRoute } from '../../../../test/render-with-providers';
import SearchPage from './SearchPage';

describe('SearchPage (integration)', () => {
  it('affiche les résultats via GET /rooms', async () => {
    renderWithRoute('/search', <SearchPage />, { routerInitialEntries: ['/search'] });

    await waitFor(() => {
      expect(screen.getByText(sampleRoomApi.name)).toBeInTheDocument();
    });
  });

  it('filtre les résultats selon le paramètre de recherche', async () => {
    renderWithRoute('/search', <SearchPage />, {
      routerInitialEntries: ['/search?q=Nice'],
    });

    await waitFor(() => {
      expect(screen.getByText(sampleRoomApi.name)).toBeInTheDocument();
    });
  });
});
