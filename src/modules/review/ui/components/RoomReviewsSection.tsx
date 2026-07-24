import type { RoomRatingSummary, Review } from '../../core/types/review.types';
import ReviewList from './ReviewList';
import StarRating from './StarRating';

type RoomReviewsSectionProps = {
  summary: RoomRatingSummary | null;
  reviews: Review[];
  loading?: boolean;
};

export default function RoomReviewsSection({
  summary,
  reviews,
  loading = false,
}: RoomReviewsSectionProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-xl bg-mist" />
        <div className="h-24 animate-pulse rounded-xl bg-mist" />
      </div>
    );
  }

  return (
    <section className="border-b border-line pb-10">
      <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-ink">Avis des voyageurs</h2>
      {summary && summary.totalReviews > 0 ? (
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <p className="font-display text-3xl font-bold text-ink">
            {summary.averageRating.toFixed(1)}
          </p>
          <div>
            <StarRating value={Math.round(summary.averageRating)} />
            <p className="mt-1 text-sm text-ink/50">
              {summary.totalReviews} avis
            </p>
          </div>
        </div>
      ) : null}
      <ReviewList reviews={reviews} />
    </section>
  );
}
