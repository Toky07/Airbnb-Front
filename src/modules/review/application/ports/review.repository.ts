import type { PaginatedResponse } from '../../../../shared/pagination/types';
import type {
  CreateReviewPayload,
  Review,
  RoomRatingSummary,
} from '../../core/types/review.types';

export interface ReviewRepository {
  listByRoomSlug(
    slug: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedResponse<Review>>;
  getRoomRatingSummary(slug: string): Promise<RoomRatingSummary | null>;
  listMine(page?: number, limit?: number): Promise<PaginatedResponse<Review>>;
  create(payload: CreateReviewPayload): Promise<{
    success: boolean;
    review?: Review;
    error?: string;
  }>;
  hasReviewForReservation(reservationId: number): Promise<boolean>;
}
