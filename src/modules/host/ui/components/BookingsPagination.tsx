import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { PaginationMeta } from '../../../../shared/pagination/types';

type BookingsPaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
};

const BookingsPagination = ({ meta, onPageChange }: BookingsPaginationProps) => {
  if (meta.totalPages <= 1) {
    return null;
  }

  const startPage = Math.max(1, Math.min(meta.page - 2, meta.totalPages - 4));

  return (
    <div className="flex items-center justify-between border-t border-slate-100 px-8 py-5">
      <p className="text-sm text-slate-500">
        Page <span className="font-medium text-slate-900">{meta.page}</span> sur{' '}
        <span className="font-medium text-slate-900">{meta.totalPages}</span> · {meta.total} résultat
        {meta.total > 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <FontAwesomeIcon icon="chevron-left" className="h-3.5 w-3.5" />
        </button>
        {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, index) => {
          const pageNum = startPage + index;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition ${
                pageNum === meta.page
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
        >
          <FontAwesomeIcon icon="chevron-right" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BookingsPagination;
