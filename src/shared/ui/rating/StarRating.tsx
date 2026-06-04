import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type StarRatingProps = {
  value: number;
  className?: string;
};

const StarRating = ({ value, className = '' }: StarRatingProps) => (
  <span className={['flex shrink-0 items-center gap-1 text-sm font-medium text-slate-900', className].join(' ')}>
    <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-amber-400" />
    {value.toFixed(2)}
  </span>
);

export default StarRating;
