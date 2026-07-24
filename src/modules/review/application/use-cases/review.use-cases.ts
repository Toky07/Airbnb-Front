import type { ReviewRepository } from '../ports/review.repository';
import type {
  CreateReviewPayload,
  Review,
  RoomRatingSummary,
} from '../../core/types/review.types';
import type { PaginatedResponse } from '../../../../shared/pagination/types';

export class ListRoomReviewsUseCase {
  constructor(private readonly repository: ReviewRepository) {}

  execute(slug: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> {
    return this.repository.listByRoomSlug(slug, page, limit);
  }
}

export class GetRoomRatingSummaryUseCase {
  constructor(private readonly repository: ReviewRepository) {}

  execute(slug: string): Promise<RoomRatingSummary | null> {
    return this.repository.getRoomRatingSummary(slug);
  }
}

export class ListMyReviewsUseCase {
  constructor(private readonly repository: ReviewRepository) {}

  execute(page = 1, limit = 20): Promise<PaginatedResponse<Review>> {
    return this.repository.listMine(page, limit);
  }
}

export class CreateReviewUseCase {
  constructor(private readonly repository: ReviewRepository) {}

  execute(payload: CreateReviewPayload) {
    return this.repository.create(payload);
  }
}

export class HasReviewForReservationUseCase {
  constructor(private readonly repository: ReviewRepository) {}

  execute(reservationId: number): Promise<boolean> {
    return this.repository.hasReviewForReservation(reservationId);
  }
}
