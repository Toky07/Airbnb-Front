import type { Review } from '../../core/types/review.types';
import StarRating from './StarRating';

function formatReviewDate(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

type ReviewListProps = {
  reviews: Review[];
  emptyMessage?: string;
};

export default function ReviewList({
  reviews,
  emptyMessage = 'Aucun avis publié pour le moment.',
}: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-ink/50">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-6">
      {reviews.map((review) => (
        <li key={review.id} className="border-b border-line pb-6 last:border-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium text-ink">
              {review.authorName ?? 'Voyageur'}
            </p>
            <StarRating value={review.rating} size="sm" />
          </div>
          <p className="mt-1 text-sm text-ink/50">{formatReviewDate(review.createdAt)}</p>
          <p className="mt-3 text-ink/70">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
