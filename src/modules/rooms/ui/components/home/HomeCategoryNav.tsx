import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const categories = [
  { icon: 'house' as const, label: 'Maisons' },
  { icon: 'location-dot' as const, label: 'Proche de vous' },
  { icon: 'bed' as const, label: 'Chambres' },
  { icon: 'users' as const, label: 'Famille' },
];

const HomeCategoryNav = () => (
  <div className="mt-8 flex items-center justify-center gap-8 overflow-x-auto pb-4 text-sm font-medium text-slate-500 hide-scrollbar">
    {categories.map((category, index) => (
      <button
        key={category.label}
        type="button"
        className={`flex flex-col items-center gap-2 border-b-2 pb-2 transition-colors ${
          index === 0
            ? 'border-slate-900 text-slate-900'
            : 'border-transparent hover:border-slate-300 hover:text-slate-900'
        }`}
      >
        <FontAwesomeIcon icon={category.icon} className="h-6 w-6" />
        <span>{category.label}</span>
      </button>
    ))}
  </div>
);

export default HomeCategoryNav;
