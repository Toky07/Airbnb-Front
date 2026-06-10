import {
  faCalendarCheck,
  faClock,
  faCoins,
  faLayerGroup,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import BookingsPagination from '../components/BookingsPagination';
import BookingsTable from '../components/BookingsTable';
import HostDashboardStatCard from '../components/HostDashboardStatCard';
import { useHostReservations } from '../hooks/useHostReservations';
import { formatHostCurrency } from '../utils/host-formatters';

const HostReservationsPage = () => {
  usePageTitle('Réservations');
  const { bookings, stats, meta, search, loading, setSearch, handleSearch, goToPage } =
    useHostReservations();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-4xl font-bold text-slate-900">Réservations</h1>
        <p className="mt-3 text-lg text-slate-500">
          Suivez toutes les réservations effectuées sur votre établissement.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <HostDashboardStatCard
          icon={faLayerGroup}
          label="Total"
          value={stats?.totalCount ?? 0}
          accent="bg-slate-100 text-slate-700"
        />
        <HostDashboardStatCard
          icon={faCalendarCheck}
          label="Confirmées"
          value={stats?.activeCount ?? 0}
          accent="bg-emerald-50 text-emerald-600"
        />
        <HostDashboardStatCard
          icon={faClock}
          label="En attente"
          value={stats?.pendingCount ?? 0}
          accent="bg-amber-50 text-amber-600"
        />
        <HostDashboardStatCard
          icon={faCoins}
          label="Revenu (mois)"
          value={formatHostCurrency(stats?.monthlyRevenue ?? 0)}
          accent="bg-rose-50 text-brand"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un client..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </form>
        </div>

        <BookingsTable bookings={bookings} loading={loading} />
        <BookingsPagination meta={meta} onPageChange={goToPage} />
      </div>
    </div>
  );
};

export default HostReservationsPage;
