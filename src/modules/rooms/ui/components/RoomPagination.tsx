import { Link, useSearchParams } from 'react-router';

type RoomPaginationProps = {
  page: number;
  totalPages: number;
};

const RoomPagination = ({ page, totalPages }: RoomPaginationProps) => {
  const [searchParams] = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(targetPage));
    return `/search?${params.toString()}`;
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-8"
    >
      <Link
        to={buildPageUrl(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={[
          'rounded-full border px-4 py-2 text-sm font-medium transition',
          page <= 1
            ? 'pointer-events-none border-slate-100 text-slate-300'
            : 'border-slate-200 text-slate-700 hover:border-slate-300',
        ].join(' ')}
      >
        Précédent
      </Link>
      <span className="px-3 text-sm text-slate-500">
        Page {page} sur {totalPages}
      </span>
      <Link
        to={buildPageUrl(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={[
          'rounded-full border px-4 py-2 text-sm font-medium transition',
          page >= totalPages
            ? 'pointer-events-none border-slate-100 text-slate-300'
            : 'border-slate-200 text-slate-700 hover:border-slate-300',
        ].join(' ')}
      >
        Suivant
      </Link>
    </nav>
  );
};

export default RoomPagination;
