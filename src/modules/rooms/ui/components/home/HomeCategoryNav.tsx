import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { RoomTypeOption } from '../hooks/useRoomTypeOptions';

type HomeCategoryNavProps = {
  roomTypes: RoomTypeOption[];
  onNearMeClick?: () => void;
};

const HomeCategoryNav = ({ roomTypes, onNearMeClick }: HomeCategoryNavProps) => {
  const chambresType = roomTypes.find((type) => /chambre/i.test(type.name));
  const maisonType = roomTypes.find((type) => /maison|appart/i.test(type.name));

  const categories = [
    {
      key: 'maisons',
      icon: 'house' as const,
      label: 'Maisons',
      to: maisonType ? `/search?roomTypeId=${maisonType.id}` : '/search?minGuests=2',
    },
    {
      key: 'near-me',
      icon: 'location-dot' as const,
      label: 'Proche de vous',
      to: null as string | null,
    },
    {
      key: 'chambres',
      icon: 'bed' as const,
      label: 'Chambres',
      to: chambresType ? `/search?roomTypeId=${chambresType.id}` : '/search',
    },
    {
      key: 'famille',
      icon: 'users' as const,
      label: 'Famille',
      to: '/search?minGuests=4',
    },
  ];

  return (
    <div className="mt-8 flex items-center justify-center gap-8 overflow-x-auto pb-4 text-sm font-medium text-slate-500 hide-scrollbar">
      {categories.map((category, index) => {
        const className = [
          'flex flex-col items-center gap-2 border-b-2 pb-2 transition-colors',
          index === 0
            ? 'border-slate-900 text-slate-900'
            : 'border-transparent hover:border-slate-300 hover:text-slate-900',
        ].join(' ');

        if (category.key === 'near-me') {
          return (
            <button
              key={category.key}
              type="button"
              onClick={onNearMeClick}
              className={className}
            >
              <FontAwesomeIcon icon={category.icon} className="h-6 w-6" />
              <span>{category.label}</span>
            </button>
          );
        }

        return (
          <Link key={category.key} to={category.to!} className={className}>
            <FontAwesomeIcon icon={category.icon} className="h-6 w-6" />
            <span>{category.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default HomeCategoryNav;
