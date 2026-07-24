import { useState } from 'react';
import { Button } from '../../../../shared/ui';
import StarRating from './StarRating';

type ReviewFormProps = {
  reservationId: number;
  onSubmit: (payload: {
    reservationId: number;
    rating: number;
    comment: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onSuccess?: () => void;
};

export default function ReviewForm({
  reservationId,
  onSubmit,
  onSuccess,
}: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    const result = await onSubmit({ reservationId, rating, comment });
    setLoading(false);

    if (result.success) {
      setSubmitted(true);
      setOpen(false);
      onSuccess?.();
      return;
    }

    setError(result.error ?? 'Impossible de publier votre avis.');
  };

  if (submitted) {
    return (
      <p className="text-sm text-emerald-700">
        Merci ! Votre avis a été envoyé et sera publié après modération.
      </p>
    );
  }

  if (!open) {
    return (
      <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
        Laisser un avis
      </Button>
    );
  }

  return (
    <div className="surface rounded-2xl p-4">
      <p className="font-medium text-ink">Partagez votre expérience</p>
      <div className="mt-3">
        <StarRating value={rating} interactive onChange={setRating} />
      </div>
      <textarea
        className="mt-4 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        rows={4}
        placeholder="Décrivez votre séjour…"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <div className="mt-4 flex gap-3">
        <Button type="button" onClick={() => void handleSubmit()} disabled={loading || !comment.trim()}>
          {loading ? 'Envoi…' : 'Publier'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
