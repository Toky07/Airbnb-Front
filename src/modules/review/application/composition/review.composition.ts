import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import type { ReviewRepository } from '../ports/review.repository';
import {
  CreateReviewUseCase,
  GetRoomRatingSummaryUseCase,
  HasReviewForReservationUseCase,
  ListMyReviewsUseCase,
  ListRoomReviewsUseCase,
} from '../use-cases/review.use-cases';
import { HttpReviewRepository } from '../../infrastructure/http-review.repository';

let reviewRepository: ReviewRepository | null = null;
let listRoomReviewsUseCase: ListRoomReviewsUseCase | null = null;
let getRoomRatingSummaryUseCase: GetRoomRatingSummaryUseCase | null = null;
let listMyReviewsUseCase: ListMyReviewsUseCase | null = null;
let createReviewUseCase: CreateReviewUseCase | null = null;
let hasReviewForReservationUseCase: HasReviewForReservationUseCase | null = null;

export function getReviewRepository(): ReviewRepository {
  if (!reviewRepository) {
    reviewRepository = new HttpReviewRepository(getHttpClient());
  }
  return reviewRepository;
}

export function getListRoomReviewsUseCase(): ListRoomReviewsUseCase {
  if (!listRoomReviewsUseCase) {
    listRoomReviewsUseCase = new ListRoomReviewsUseCase(getReviewRepository());
  }
  return listRoomReviewsUseCase;
}

export function getGetRoomRatingSummaryUseCase(): GetRoomRatingSummaryUseCase {
  if (!getRoomRatingSummaryUseCase) {
    getRoomRatingSummaryUseCase = new GetRoomRatingSummaryUseCase(
      getReviewRepository(),
    );
  }
  return getRoomRatingSummaryUseCase;
}

export function getListMyReviewsUseCase(): ListMyReviewsUseCase {
  if (!listMyReviewsUseCase) {
    listMyReviewsUseCase = new ListMyReviewsUseCase(getReviewRepository());
  }
  return listMyReviewsUseCase;
}

export function getCreateReviewUseCase(): CreateReviewUseCase {
  if (!createReviewUseCase) {
    createReviewUseCase = new CreateReviewUseCase(getReviewRepository());
  }
  return createReviewUseCase;
}

export function getHasReviewForReservationUseCase(): HasReviewForReservationUseCase {
  if (!hasReviewForReservationUseCase) {
    hasReviewForReservationUseCase = new HasReviewForReservationUseCase(
      getReviewRepository(),
    );
  }
  return hasReviewForReservationUseCase;
}
