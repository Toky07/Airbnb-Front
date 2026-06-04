import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: { label: string; href: string };
  children?: ReactNode;
};

const SectionHeader = ({
  title,
  description,
  align = 'left',
  action,
  children,
}: SectionHeaderProps) => (
  <div
    className={[
      'flex flex-col gap-4',
      align === 'center' ? 'text-center' : 'sm:flex-row sm:items-end sm:justify-between',
    ].join(' ')}
  >
    <div className={align === 'center' ? 'mx-auto' : ''}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
      {description && (
        <p
          className={[
            'mt-2 text-slate-600',
            align === 'center' ? 'mx-auto max-w-xl' : 'max-w-lg',
          ].join(' ')}
        >
          {description}
        </p>
      )}
      {children}
    </div>
    {action && (
      <a
        href={action.href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand)] transition hover:gap-3"
      >
        {action.label}
        <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
      </a>
    )}
  </div>
);

export default SectionHeader;
