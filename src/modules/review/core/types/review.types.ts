export type ReviewStatus = 'pending' | 'published' | 'hidden';

export type Review = {
  id: number;
  userId: number;
  reservationId: number;
  roomId: number;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  authorName?: string;
};

export type RoomRatingSummary = {
  averageRating: number;
  totalReviews: number;
  distribution: Record<number, number>;
};

export type CreateReviewPayload = {
  reservationId: number;
  rating: number;
  comment: string;
};

export type ModerateReviewPayload = {
  status: 'published' | 'hidden';
};
