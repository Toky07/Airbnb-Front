import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { resolveAmenityIcon } from '../../../../shared/utils/resolve-amenity-icon';
import type { AmenityItem } from '../../core/types/amenity.types';

type AmenityListProps = {
  title: string;
  amenities: AmenityItem[];
};

const AmenityList = ({ title, amenities }: AmenityListProps) => {
  if (amenities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        {amenities.map((amenity) => (
          <li key={amenity.id} className="flex items-center gap-3 text-sm text-slate-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <FontAwesomeIcon
                icon={resolveAmenityIcon(amenity.icon)}
                className="h-4 w-4"
              />
            </span>
            {amenity.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AmenityList;
