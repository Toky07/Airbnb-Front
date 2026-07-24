import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../shared/http/parse-api-error';
import type { PaginatedResponse } from '../../../shared/pagination/types';
import type { ReviewRepository } from '../application/ports/review.repository';
import {
  parseReview,
  parseReviewList,
  parseRoomRatingSummary,
} from '../core/mappers/map-review';
import type {
  CreateReviewPayload,
  Review,
  RoomRatingSummary,
} from '../core/types/review.types';

export class HttpReviewRepository implements ReviewRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient?: HttpClient) {
    this.httpClient = httpClient ?? getHttpClient();
  }

  async listByRoomSlug(
    slug: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Review>> {
    const response = await this.httpClient.get(
      `/rooms/by-slug/${encodeURIComponent(slug)}/reviews?page=${page}&limit=${limit}`,
    );
    const data: unknown = await response.json();
    if (!response.ok) {
      return {
        data: [],
        meta: { page, limit, total: 0, totalPages: 0 },
      };
    }
    return parseReviewList(data);
  }

  async getRoomRatingSummary(slug: string): Promise<RoomRatingSummary | null> {
    const response = await this.httpClient.get(
      `/rooms/by-slug/${encodeURIComponent(slug)}/rating-summary`,
    );
    const data: unknown = await response.json();
    if (!response.ok) {
      return null;
    }
    return parseRoomRatingSummary(data);
  }

  async listMine(page = 1, limit = 20): Promise<PaginatedResponse<Review>> {
    const response = await this.httpClient.get(
      `/reviews/me?page=${page}&limit=${limit}`,
    );
    const data: unknown = await response.json();
    if (!response.ok) {
      return {
        data: [],
        meta: { page, limit, total: 0, totalPages: 0 },
      };
    }
    return parseReviewList(data);
  }

  async create(payload: CreateReviewPayload): Promise<{
    success: boolean;
    review?: Review;
    error?: string;
  }> {
    const response = await this.httpClient.post('/reviews', payload);
    const data: unknown = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: parseApiError(data, 'Impossible de publier votre avis.'),
      };
    }
    const review = parseReview(data);
    if (!review) {
      return { success: false, error: 'Réponse invalide.' };
    }
    return { success: true, review };
  }

  async hasReviewForReservation(reservationId: number): Promise<boolean> {
    const result = await this.listMine(1, 100);
    return result.data.some(
      (review) => review.reservationId === reservationId,
    );
  }
}
