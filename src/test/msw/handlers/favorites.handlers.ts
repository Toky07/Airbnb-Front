import { http, HttpResponse } from 'msw';
import { sampleRoomApi } from '../../fixtures/rooms-api.fixtures';
import { apiUrl } from '../api-base-url';
import { getFavoriteState, resetFavoriteState, setFavoriteState } from '../state/favorite.state';

export { resetFavoriteState };

export const favoritesHandlers = [
  http.get(apiUrl('/favorites/me'), () => HttpResponse.json(getFavoriteState())),

  http.post(apiUrl('/favorites'), async ({ request }) => {
    const body = (await request.json()) as { roomId?: number };
    if (!body.roomId) {
      return HttpResponse.json({ message: 'Données invalides.' }, { status: 400 });
    }

    const favorites = getFavoriteState();
    const existing = favorites.find((favorite) => favorite.roomId === body.roomId);
    if (existing) {
      return HttpResponse.json(
        { message: 'Ce logement est déjà dans vos favoris.' },
        { status: 400 },
      );
    }

    const next = [
      {
        id: favorites.length + 1,
        roomId: body.roomId,
        createdAt: new Date().toISOString(),
        room: { ...sampleRoomApi, id: body.roomId },
      },
      ...favorites,
    ];
    setFavoriteState(next);
    return HttpResponse.json(next[0], { status: 201 });
  }),

  http.delete(apiUrl('/favorites/:roomId'), ({ params }) => {
    const roomId = Number(params.roomId);
    setFavoriteState(getFavoriteState().filter((favorite) => favorite.roomId !== roomId));
    return new HttpResponse(null, { status: 200 });
  }),

  http.get(apiUrl('/favorites/check'), ({ request }) => {
    const url = new URL(request.url);
    const roomIds = (url.searchParams.get('roomIds') ?? '')
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((id) => Number.isInteger(id) && id > 0);

    const favorited = new Set(getFavoriteState().map((favorite) => favorite.roomId));
    const favorites = Object.fromEntries(
      roomIds.map((roomId) => [String(roomId), favorited.has(roomId)]),
    );

    return HttpResponse.json({ favorites });
  }),
];
