import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';

type PillProps = {
  children: ReactNode;
  icon?: IconDefinition;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

const Pill = ({ children, icon, active = false, onClick, className = '' }: PillProps) => {
  const base =
    'flex shrink-0 items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-medium transition';
  const state = active
    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={[base, state, className].join(' ')}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={active ? 'h-4 w-4 text-rose-300' : 'h-4 w-4 text-slate-400'}
          />
        )}
        {children}
      </button>
    );
  }

  return (
    <span className={[base, state, className].join(' ')}>
      {icon && <FontAwesomeIcon icon={icon} className="h-4 w-4 text-slate-400" />}
      {children}
    </span>
  );
};

export default Pill;
