import { faBed, faCalendarCheck, faChartLine, faEuroSign, faHotel, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';
import { Button, PageSkeleton } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import HostDashboardStatCard from '../components/HostDashboardStatCard';
import HostRecentActivityList from '../components/HostRecentActivityList';
import { useHostDashboard } from '../hooks/useHostDashboard';
import { formatHostCurrency } from '../utils/host-formatters';

const HostDashboardPage = () => {
  usePageTitle('Tableau de bord');
  const { profile, roomsCount, reservationStats, recentActivity, loading } = useHostDashboard();

  if (loading) {
    return <PageSkeleton className="h-64" />;
  }

  const properties = profile?.properties ?? [];
  const hasProperties = properties.length > 0;
  const propertyLabel =
    properties.length === 0
      ? 'Non configuré'
      : properties.length === 1
        ? properties[0].name
        : `${properties.length} établissements`;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-4xl font-bold text-slate-900">
          Bonjour, {profile?.user.firstName ?? 'Hôte'}
        </h1>
        <p className="mt-3 text-lg text-slate-500">Voici un aperçu de votre activité aujourd'hui.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Établissements</p>
              <p className="mt-3 font-serif text-2xl font-bold text-slate-900">{propertyLabel}</p>
              {properties.length === 1 ? (
                <p className="mt-1 text-sm text-slate-500">
                  {properties[0].city}, {properties[0].country}
                </p>
              ) : null}
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-brand">
              <FontAwesomeIcon icon={faHotel} className="h-5 w-5" />
            </span>
          </div>
          <Link to="/host/property" className="mt-8 inline-block">
            <Button variant={hasProperties ? 'secondary' : 'primary'} size="sm">
              {hasProperties ? 'Gérer mes établissements' : 'Créer mon établissement'}
            </Button>
          </Link>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Chambres publiées
              </p>
              <p className="mt-3 font-serif text-3xl font-bold text-slate-900">{roomsCount}</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <FontAwesomeIcon icon={faBed} className="h-5 w-5" />
            </span>
          </div>
          <Link to="/host/property" className="mt-8 inline-block">
            <Button variant="secondary" size="sm" disabled={!hasProperties}>
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-3.5 w-3.5" />
              Voir les établissements
            </Button>
          </Link>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Réservations
              </p>
              <p className="mt-3 font-serif text-3xl font-bold text-slate-900">
                {reservationStats?.totalCount ?? 0}
              </p>
              {reservationStats && reservationStats.pendingCount > 0 ? (
                <p className="mt-1 text-sm font-medium text-amber-600">
                  {reservationStats.pendingCount} en attente
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">
                  {reservationStats?.activeCount ?? 0} séjour
                  {(reservationStats?.activeCount ?? 0) > 1 ? 's' : ''} actif
                  {(reservationStats?.activeCount ?? 0) > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FontAwesomeIcon icon={faCalendarCheck} className="h-5 w-5" />
            </span>
          </div>
          <Link to="/host/reservations" className="mt-8 inline-block">
            <Button variant="secondary" size="sm">
              Voir les réservations
            </Button>
          </Link>
        </div>

        <HostDashboardStatCard
          icon={faChartLine}
          label="Taux d'occupation"
          value={`${Math.round(reservationStats?.occupancyRate ?? 0)} %`}
          accent="bg-sky-50 text-sky-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">Activité récente</h2>
              <p className="mt-1 text-sm text-slate-500">Vos dernières réservations confirmées.</p>
            </div>
            <Link to="/host/reservations">
              <Button variant="secondary" size="sm">
                Tout voir
              </Button>
            </Link>
          </div>
          <div className="mt-6">
            <HostRecentActivityList activities={recentActivity} />
          </div>
        </section>

        <HostDashboardStatCard
          icon={faEuroSign}
          label="Revenus du mois"
          value={formatHostCurrency(reservationStats?.monthlyRevenue ?? 0)}
          accent="bg-amber-50 text-amber-600"
        />
      </div>

      {!hasProperties ? (
        <div className="rounded-3xl border border-dashed border-brand/30 bg-rose-50/50 p-8">
          <h2 className="font-serif text-xl font-bold text-slate-900">Commencez ici</h2>
          <p className="mt-2 text-slate-600">
            Créez d&apos;abord votre établissement, puis ajoutez vos chambres pour les rendre visibles
            sur le site public.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default HostDashboardPage;
