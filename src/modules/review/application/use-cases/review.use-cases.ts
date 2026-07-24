import type { ReviewRepository } from '../ports/review.repository';
import type {
  CreateReviewPayload,
  Review,
  RoomRatingSummary,
} from '../../core/types/review.types';
import type { PaginatedResponse } from '../../../../shared/pagination/types';

export class ListRoomReviewsUseCase {
  private readonly repository: ReviewRepository;

  constructor(repository: ReviewRepository) {
    this.repository = repository;
  }

  execute(slug: string, page = 1, limit = 10): Promise<PaginatedResponse<Review>> {
    return this.repository.listByRoomSlug(slug, page, limit);
  }
}

export class GetRoomRatingSummaryUseCase {
  private readonly repository: ReviewRepository;

  constructor(repository: ReviewRepository) {
    this.repository = repository;
  }

  execute(slug: string): Promise<RoomRatingSummary | null> {
    return this.repository.getRoomRatingSummary(slug);
  }
}

export class ListMyReviewsUseCase {
  private readonly repository: ReviewRepository;

  constructor(repository: ReviewRepository) {
    this.repository = repository;
  }

  execute(page = 1, limit = 20): Promise<PaginatedResponse<Review>> {
    return this.repository.listMine(page, limit);
  }
}

export class CreateReviewUseCase {
  private readonly repository: ReviewRepository;

  constructor(repository: ReviewRepository) {
    this.repository = repository;
  }

  execute(payload: CreateReviewPayload) {
    return this.repository.create(payload);
  }
}

export class HasReviewForReservationUseCase {
  private readonly repository: ReviewRepository;

  constructor(repository: ReviewRepository) {
    this.repository = repository;
  }

  execute(reservationId: number): Promise<boolean> {
    return this.repository.hasReviewForReservation(reservationId);
  }
}
