import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import BookingsPagination from '../components/BookingsPagination';
import BookingsTable from '../components/BookingsTable';
import HostDashboardStatCard from '../components/HostDashboardStatCard';
import { useHostReservations } from '../hooks/useHostReservations';
import { formatHostCurrency } from '../utils/host-formatters';

const HostReservationsPage = () => {
  usePageTitle('Réservations');
  const { bookings, properties, stats, meta, search, propertyId, loading, setSearch, setPropertyId, handleSearch, goToPage, refresh } =
    useHostReservations();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-4xl font-bold text-ink">Réservations</h1>
        <p className="mt-3 text-lg text-ink/50">
          Suivez toutes les réservations effectuées sur votre établissement.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <HostDashboardStatCard
          icon="layer-group"
          label="Total"
          value={stats?.totalCount ?? 0}
          accent="bg-mist text-ink/70"
        />
        <HostDashboardStatCard
          icon="calendar-check"
          label="Confirmées"
          value={stats?.activeCount ?? 0}
          accent="bg-emerald-500/10 text-emerald-700"
        />
        <HostDashboardStatCard
          icon="clock"
          label="En attente"
          value={stats?.pendingCount ?? 0}
          accent="bg-amber-500/10 text-amber-700"
        />
        <HostDashboardStatCard
          icon="coins"
          label="Revenu (mois)"
          value={formatHostCurrency(stats?.monthlyRevenue ?? 0)}
          accent="bg-brand/10 text-brand"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-surface soft-shadow">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-ink/8 px-8 py-6 sm:flex-row sm:items-center">
          <h2 className="font-display text-2xl font-bold text-ink">Commandes récentes</h2>
          <div className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
            {properties.length > 1 ? (
              <select
                value={propertyId ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  setPropertyId(value ? Number.parseInt(value, 10) : null);
                }}
                className="rounded-xl border border-line bg-mist/60 px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:bg-surface focus:ring-2 focus:ring-brand/20"
              >
                <option value="">Tous les établissements</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
            ) : null}
            <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <FontAwesomeIcon
                icon="magnifying-glass"
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un client..."
                className="w-full rounded-xl border border-line bg-mist/60 py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 outline-none transition focus:border-brand focus:bg-surface focus:ring-2 focus:ring-brand/20"
              />
            </div>
            </form>
          </div>
        </div>

        <BookingsTable bookings={bookings} loading={loading} onUpdated={refresh} />
        <BookingsPagination meta={meta} onPageChange={goToPage} />
      </div>
    </div>
  );
};

export default HostReservationsPage;
