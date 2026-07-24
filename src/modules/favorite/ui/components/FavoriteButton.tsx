import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFavoriteToggle } from '../hooks/useFavoriteToggle';

type FavoriteButtonProps = {
  roomId: number;
  className?: string;
  size?: 'sm' | 'md';
};

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
};

const FavoriteButton = ({
  roomId,
  className = '',
  size = 'md',
}: FavoriteButtonProps) => {
  const { isFavorite, loading, toggle } = useFavoriteToggle(roomId);

  return (
    <button
      type="button"
      aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={isFavorite}
      disabled={loading}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggle();
      }}
      className={[
        'inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/95 text-slate-700 shadow-sm backdrop-blur-md transition hover:scale-105 hover:border-slate-300 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60',
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      <FontAwesomeIcon
        icon="heart"
        className={isFavorite ? 'text-brand' : 'text-slate-500 opacity-80'}
      />
    </button>
  );
};

export default FavoriteButton;
