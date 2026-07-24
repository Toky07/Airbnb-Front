import { http, HttpResponse } from 'msw';
import { apiUrl } from '../api-base-url';

export const reviewsHandlers = [
  http.get(apiUrl('/reviews/me'), () =>
    HttpResponse.json({
      data: [],
      meta: { page: 1, limit: 100, total: 0, totalPages: 0 },
    }),
  ),

  http.post(apiUrl('/reviews'), async () =>
    HttpResponse.json(
      {
        id: 1,
        reservationId: 1,
        roomId: 1,
        rating: 5,
        comment: 'Excellent séjour',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    ),
  ),
];
