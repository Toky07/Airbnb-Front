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
          'rounded-xl border px-4 py-2 text-sm font-medium transition duration-200',
          page <= 1
            ? 'pointer-events-none border-line/60 text-ink/30'
            : 'border-line text-ink/70 hover:border-brand/30 hover:bg-mist',
        ].join(' ')}
      >
        Précédent
      </Link>
      <span className="px-3 text-sm text-ink/50">
        Page {page} sur {totalPages}
      </span>
      <Link
        to={buildPageUrl(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={[
          'rounded-xl border px-4 py-2 text-sm font-medium transition duration-200',
          page >= totalPages
            ? 'pointer-events-none border-line/60 text-ink/30'
            : 'border-line text-ink/70 hover:border-brand/30 hover:bg-mist',
        ].join(' ')}
      >
        Suivant
      </Link>
    </nav>
  );
};

export default RoomPagination;
