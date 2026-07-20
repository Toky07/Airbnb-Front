import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { sampleRoomApi } from '../../../../test/fixtures/rooms-api.fixtures';
import { renderWithRoute } from '../../../../test/render-with-providers';
import RoomDetailPage from './RoomDetailPage';

describe('RoomDetailPage (integration)', () => {
  it('charge le logement via GET /rooms/by-slug/:slug', async () => {
    await renderWithRoute('/rooms/:slug', <RoomDetailPage />, {
      routerInitialEntries: [`/rooms/${sampleRoomApi.slug}`],
    });

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: sampleRoomApi.name })).toBeInTheDocument();
    });

    expect(screen.getByText('Nice, France')).toBeInTheDocument();
  });

  it('affiche une erreur lorsque le slug est inconnu', async () => {
    await renderWithRoute('/rooms/:slug', <RoomDetailPage />, {
      routerInitialEntries: ['/rooms/unknown-slug'],
    });

    await waitFor(() => {
      expect(screen.getByText(/logement introuvable/i)).toBeInTheDocument();
    });
  });
});
