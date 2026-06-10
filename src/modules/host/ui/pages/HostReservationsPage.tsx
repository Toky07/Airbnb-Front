import {
  faCalendarCheck,
  faChevronLeft,
  faChevronRight,
  faClock,
  faCoins,
  faLayerGroup,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getHostReservationService,
  type HostBookingOrder,
  type HostReservationStats,
} from '../../core/services/host.service';
import type { PaginationMeta } from '../../../../shared/pagination/types';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

type PaymentStatusKey = 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';

const statusConfig: Record<PaymentStatusKey, { label: string; className: string }> = {
  pending: { label: 'En attente', className: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  processing: { label: 'En cours', className: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  succeeded: { label: 'Payée', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  failed: { label: 'Échouée', className: 'bg-red-50 text-red-700 ring-red-600/20' },
  canceled: { label: 'Annulée', className: 'bg-slate-50 text-slate-600 ring-slate-500/20' },
};

function PaymentBadge({ status }: { status: string }) {
  const config = statusConfig[status as PaymentStatusKey] ?? statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: typeof faCalendarCheck;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-5">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
          <FontAwesomeIcon icon={icon} className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

const HostReservationsPage = () => {
  const [bookings, setBookings] = useState<HostBookingOrder[]>([]);
  const [stats, setStats] = useState<HostReservationStats | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const serviceRef = useRef(getHostReservationService());

  const loadData = useCallback(async (page = 1, searchTerm = '') => {
    setLoading(true);
    const svc = serviceRef.current;
    const [bookingsRes, statsRes] = await Promise.all([
      svc.listBookings({ page, limit: 10, search: searchTerm }),
      svc.getStats(),
    ]);
    setBookings(bookingsRes.data);
    setMeta(bookingsRes.meta);
    setStats(statsRes);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void loadData(1, search);
  };

  const goToPage = (page: number) => {
    void loadData(page, search);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-slate-900">Réservations</h1>
        <p className="mt-3 text-lg text-slate-500">
          Suivez toutes les réservations effectuées sur votre établissement.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={faLayerGroup}
          label="Total"
          value={stats?.totalCount ?? 0}
          accent="bg-slate-100 text-slate-700"
        />
        <StatCard
          icon={faCalendarCheck}
          label="Confirmées"
          value={stats?.activeCount ?? 0}
          accent="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon={faClock}
          label="En attente"
          value={stats?.pendingCount ?? 0}
          accent="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon={faCoins}
          label="Revenu (mois)"
          value={formatCurrency(stats?.monthlyRevenue ?? 0)}
          accent="bg-rose-50 text-brand"
        />
      </div>

      {/* Search & Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 px-8 py-6 sm:flex-row sm:items-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900">Commandes récentes</h2>
          <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center gap-2">
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un client..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </form>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-4 p-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-50" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
              <FontAwesomeIcon icon={faCalendarCheck} className="h-8 w-8 text-slate-300" />
            </div>
            <p className="mt-6 text-xl font-bold text-slate-900">Aucune réservation</p>
            <p className="mt-2 text-slate-500">
              Les réservations de vos clients apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">Client</th>
                  <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">Date</th>
                  <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">Articles</th>
                  <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">Montant</th>
                  <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">Statut</th>
                  <th className="whitespace-nowrap px-8 py-4 font-semibold uppercase tracking-wider text-slate-500">Réf.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr
                    key={booking.paymentId}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="whitespace-nowrap px-8 py-5">
                      <div>
                        <p className="font-bold text-slate-900">{booking.customerName}</p>
                        <p className="mt-0.5 text-sm text-slate-500">{booking.customerEmail}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-8 py-5 text-slate-600">
                      {formatDate(booking.paidAt)}
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-medium text-slate-900">{booking.itemCount} séjour{booking.itemCount > 1 ? 's' : ''}</span>
                      {booking.previewLabel ? (
                        <p className="mt-1 max-w-[250px] truncate text-sm text-slate-500">
                          {booking.previewLabel}
                        </p>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-8 py-5 text-lg font-bold text-slate-900">
                      {formatCurrency(booking.amount)}
                    </td>
                    <td className="whitespace-nowrap px-8 py-5">
                      <PaymentBadge status={booking.paymentStatus} />
                    </td>
                    <td className="whitespace-nowrap px-8 py-5">
                      <span className="font-mono text-xs text-slate-400">
                        {booking.transactionId.slice(0, 12)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 ? (
          <div className="flex items-center justify-between border-t border-slate-100 px-8 py-5">
            <p className="text-sm text-slate-500">
              Page <span className="font-medium text-slate-900">{meta.page}</span> sur <span className="font-medium text-slate-900">{meta.totalPages}</span> · {meta.total} résultat{meta.total > 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(meta.page - 1)}
                disabled={meta.page <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="h-3.5 w-3.5" />
              </button>
              {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                const startPage = Math.max(1, Math.min(meta.page - 2, meta.totalPages - 4));
                const pageNum = startPage + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
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
                onClick={() => goToPage(meta.page + 1)}
                disabled={meta.page >= meta.totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-40"
              >
                <FontAwesomeIcon icon={faChevronRight} className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HostReservationsPage;
