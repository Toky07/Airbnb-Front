import type { FormEvent, ReactNode } from 'react';

type SearchShellProps = {
  children: ReactNode;
  className?: string;
  onSubmit?: (event: FormEvent) => void;
};

const SearchShell = ({
  children,
  className = '',
  onSubmit = (e) => e.preventDefault(),
}: SearchShellProps) => (
  <form
    onSubmit={onSubmit}
    className={[
      'mx-auto w-full max-w-4xl rounded-2xl border border-white/20 bg-white/95 p-2 shadow-2xl shadow-black/20 backdrop-blur-md sm:rounded-full sm:p-1.5',
      className,
    ].join(' ')}
  >
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">{children}</div>
  </form>
);

export default SearchShell;
