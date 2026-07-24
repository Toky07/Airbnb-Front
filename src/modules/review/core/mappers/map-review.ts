import type { PaginatedResponse } from '../../../../shared/pagination/types';
import type {
  Review,
  RoomRatingSummary,
} from '../types/review.types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function mapReview(raw: Record<string, unknown>): Review | null {
  const id = raw.id;
  const userId = raw.userId;
  const reservationId = raw.reservationId;
  const roomId = raw.roomId;
  const rating = raw.rating;
  const comment = raw.comment;
  const status = raw.status;
  const createdAt = raw.createdAt;

  if (
    typeof id !== 'number' ||
    typeof userId !== 'number' ||
    typeof reservationId !== 'number' ||
    typeof roomId !== 'number' ||
    typeof rating !== 'number' ||
    typeof comment !== 'string' ||
    typeof status !== 'string' ||
    typeof createdAt !== 'string'
  ) {
    return null;
  }

  return {
    id,
    userId,
    reservationId,
    roomId,
    rating,
    comment,
    status: status as Review['status'],
    createdAt,
    authorName:
      typeof raw.authorName === 'string' ? raw.authorName : undefined,
  };
}

export function parseReviewList(data: unknown): PaginatedResponse<Review> {
  if (!isRecord(data) || !Array.isArray(data.data) || !isRecord(data.meta)) {
    return {
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  const reviews = data.data
    .map((item) => (isRecord(item) ? mapReview(item) : null))
    .filter((item): item is Review => item !== null);

  return {
    data: reviews,
    meta: {
      page: typeof data.meta.page === 'number' ? data.meta.page : 1,
      limit: typeof data.meta.limit === 'number' ? data.meta.limit : 10,
      total: typeof data.meta.total === 'number' ? data.meta.total : 0,
      totalPages:
        typeof data.meta.totalPages === 'number' ? data.meta.totalPages : 0,
    },
  };
}

export function parseReview(data: unknown): Review | null {
  return isRecord(data) ? mapReview(data) : null;
}

export function parseRoomRatingSummary(data: unknown): RoomRatingSummary | null {
  if (!isRecord(data)) {
    return null;
  }

  const averageRating = data.averageRating;
  const totalReviews = data.totalReviews;
  const distribution = data.distribution;

  if (
    typeof averageRating !== 'number' ||
    typeof totalReviews !== 'number' ||
    !isRecord(distribution)
  ) {
    return null;
  }

  return {
    averageRating,
    totalReviews,
    distribution: distribution as Record<number, number>,
  };
}
