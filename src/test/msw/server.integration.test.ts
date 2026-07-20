import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './server';
import { apiUrl } from './api-base-url';
import { sampleRoomsListApi } from '../fixtures/rooms-api.fixtures';

describe('MSW server', () => {
  it('intercepte GET /rooms', async () => {
    const response = await fetch(apiUrl('/rooms?page=1&limit=10'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(sampleRoomsListApi);
  });

  it('permet de surcharger un handler dans un test via server.use()', async () => {
    server.use(
      http.get(apiUrl('/rooms'), () =>
        HttpResponse.json({
          data: [],
          meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
        }),
      ),
    );

    const response = await fetch(apiUrl('/rooms'));
    const data = await response.json();

    expect(data.data).toEqual([]);
  });
});
