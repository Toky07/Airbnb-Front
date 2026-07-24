import type { ReactNode } from 'react';

type HostDataTableProps = {
  children: ReactNode;
  className?: string;
};

const HostDataTable = ({ children, className = '' }: HostDataTableProps) => (
  <div
    className={[
      'overflow-hidden rounded-2xl border border-ink/8 bg-surface soft-shadow',
      className,
    ].join(' ')}
  >
    <div className="overflow-x-auto">{children}</div>
  </div>
);

type HostDataTableHeadProps = {
  children: ReactNode;
};

export const HostDataTableHead = ({ children }: HostDataTableHeadProps) => (
  <thead className="bg-mist/60">
    <tr>{children}</tr>
  </thead>
);

type HostDataTableHeaderCellProps = {
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
};

export const HostDataTableHeaderCell = ({
  children,
  align = 'left',
  className = '',
}: HostDataTableHeaderCellProps) => (
  <th
    scope="col"
    className={[
      'px-5 py-4 text-xs font-bold uppercase tracking-wider text-ink/50',
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
      className,
    ].join(' ')}
  >
    {children}
  </th>
);

type HostDataTableBodyProps = {
  children: ReactNode;
};

export const HostDataTableBody = ({ children }: HostDataTableBodyProps) => (
  <tbody className="divide-y divide-ink/8">{children}</tbody>
);

type HostDataTableRowProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export const HostDataTableRow = ({ children, onClick, className = '' }: HostDataTableRowProps) => {
  const interactive = Boolean(onClick);

  return (
    <tr
      onClick={onClick}
      className={[
        interactive ? 'cursor-pointer transition hover:bg-mist/40' : '',
        className,
      ].join(' ')}
    >
      {children}
    </tr>
  );
};

type HostDataTableCellProps = {
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
};

export const HostDataTableCell = ({
  children,
  align = 'left',
  className = '',
}: HostDataTableCellProps) => (
  <td
    className={[
      'px-5 py-4 text-sm text-ink/70',
      align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left',
      className,
    ].join(' ')}
  >
    {children}
  </td>
);

export default HostDataTable;
