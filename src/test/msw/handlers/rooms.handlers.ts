import { http, HttpResponse } from 'msw';
import { sampleRoomApi, sampleRoomsListApi } from '../../fixtures/rooms-api.fixtures';
import { apiUrl } from '../api-base-url';

const emptyReviewsPage = {
  data: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
};

const emptyRatingSummary = {
  averageRating: 0,
  totalReviews: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

export const roomsHandlers = [
  http.get(apiUrl('/rooms'), ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';

    if (!search) {
      return HttpResponse.json(sampleRoomsListApi);
    }

    const matchesSearch =
      sampleRoomApi.name.toLowerCase().includes(search) ||
      sampleRoomApi.property.city.toLowerCase().includes(search);

    return HttpResponse.json({
      data: matchesSearch ? [sampleRoomApi] : [],
      meta: {
        page: 1,
        limit: 10,
        total: matchesSearch ? 1 : 0,
        totalPages: matchesSearch ? 1 : 0,
      },
    });
  }),

  // Routes plus spécifiques avant `/rooms/by-slug/:slug`.
  http.get(apiUrl('/rooms/by-slug/:slug/pricing-preview'), () =>
    HttpResponse.json({
      subtotalCents: 24000,
      vatCents: 2400,
      touristTaxCents: 0,
      serviceFeeCents: 0,
      totalCents: 26400,
    }),
  ),

  http.get(apiUrl('/rooms/by-slug/:slug/reviews'), () =>
    HttpResponse.json(emptyReviewsPage),
  ),

  http.get(apiUrl('/rooms/by-slug/:slug/rating-summary'), () =>
    HttpResponse.json(emptyRatingSummary),
  ),

  http.get(apiUrl('/rooms/by-slug/:slug'), ({ params }) => {
    if (params.slug === sampleRoomApi.slug) {
      return HttpResponse.json(sampleRoomApi);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  http.get(apiUrl('/rooms/:id'), ({ params }) => {
    if (String(params.id) === String(sampleRoomApi.id)) {
      return HttpResponse.json(sampleRoomApi);
    }

    return new HttpResponse(null, { status: 404 });
  }),

  http.get(apiUrl('/room-types/options'), () => HttpResponse.json([])),

  http.get(apiUrl('/amenities/catalog'), () => HttpResponse.json([])),
];
