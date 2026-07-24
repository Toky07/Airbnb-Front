import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import FavoritesPage from './FavoritesPage';
import { renderWithRoute } from '../../../../test/render-with-providers';
import { resetFavoriteState } from '../../../../test/msw/handlers/favorites.handlers';
import { server } from '../../../../test/msw/server';
import { http, HttpResponse } from 'msw';
import { apiUrl } from '../../../../test/msw/api-base-url';

describe('FavoritesPage (integration)', () => {
  beforeEach(() => {
    resetFavoriteState();
    localStorage.setItem('auth_token', 'jwt-token');
  });

  it('affiche l’état vide sans favori', async () => {
    server.use(http.get(apiUrl('/favorites/me'), () => HttpResponse.json([])));

    await renderWithRoute('/account/favorites', <FavoritesPage />, {
      routerInitialEntries: ['/account/favorites'],
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /mes favoris/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/pas encore de favori/i)).toBeInTheDocument();
  });
});
