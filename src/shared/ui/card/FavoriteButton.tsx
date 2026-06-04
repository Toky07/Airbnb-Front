import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type FavoriteButtonProps = {
  label?: string;
  onClick?: () => void;
};

const FavoriteButton = ({
  label = 'Ajouter aux favoris',
  onClick,
}: FavoriteButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition hover:bg-black/40"
  >
    <FontAwesomeIcon icon={faHeart} className="h-3.5 w-3.5" />
  </button>
);

export default FavoriteButton;
