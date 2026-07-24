type StarRatingProps = {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  interactive?: boolean;
  onChange?: (value: number) => void;
};

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
};

export default function StarRating({
  value,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} sur ${max}`}>
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;
        const className = `${sizeClasses[size]} ${filled ? 'text-brand' : 'text-line'}`;

        if (interactive && onChange) {
          return (
            <button
              key={starValue}
              type="button"
              className={className}
              onClick={() => onChange(starValue)}
              aria-label={`${starValue} étoile${starValue > 1 ? 's' : ''}`}
            >
              ★
            </button>
          );
        }

        return (
          <span key={starValue} className={className} aria-hidden="true">
            ★
          </span>
        );
      })}
    </div>
  );
}
