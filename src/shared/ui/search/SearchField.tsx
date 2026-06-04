import type { ReactNode } from 'react';

type SearchFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

const SearchField = ({ label, children, className = '' }: SearchFieldProps) => (
  <label className={['flex flex-1 flex-col px-4 py-3 sm:py-4', className].join(' ')}>
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    <div className="mt-0.5">{children}</div>
  </label>
);

export default SearchField;
