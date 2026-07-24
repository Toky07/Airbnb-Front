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
    return <p className="text-slate-500">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-6">
      {reviews.map((review) => (
        <li key={review.id} className="border-b border-slate-100 pb-6 last:border-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium text-slate-900">
              {review.authorName ?? 'Voyageur'}
            </p>
            <StarRating value={review.rating} size="sm" />
          </div>
          <p className="mt-1 text-sm text-slate-500">{formatReviewDate(review.createdAt)}</p>
          <p className="mt-3 text-slate-700">{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}
