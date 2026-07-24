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
    'flex shrink-0 items-center gap-2.5 rounded-xl border px-5 py-2.5 text-sm font-medium transition duration-200';
  const state = active
    ? 'border-brand bg-brand text-white'
    : 'border-line bg-surface text-ink/70 hover:border-brand/30 hover:bg-mist';

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={[base, state, className].join(' ')}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className={active ? 'h-4 w-4 text-white/80' : 'h-4 w-4 text-ink/40'}
          />
        )}
        {children}
      </button>
    );
  }

  return (
    <span className={[base, state, className].join(' ')}>
      {icon && <FontAwesomeIcon icon={icon} className="h-4 w-4 text-ink/40" />}
      {children}
    </span>
  );
};

export default Pill;
