import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';
import { Button, PageSkeleton } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import HostDashboardStatCard from '../components/HostDashboardStatCard';
import HostRecentActivityList from '../components/HostRecentActivityList';
import HostStripeConnectBanner from '../components/HostStripeConnectBanner';
import { useHostDashboard } from '../hooks/useHostDashboard';
import { formatHostCurrency } from '../utils/host-formatters';

const HostDashboardPage = () => {
  usePageTitle('Tableau de bord');
  const {
    profile,
    roomsCount,
    reservationStats,
    recentActivity,
    loading,
    stripeBusy,
    stripeError,
    startStripeOnboarding,
    openStripeDashboard,
  } = useHostDashboard();

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
        <h1 className="font-display text-4xl font-bold text-ink">
          Bonjour, {profile?.user.firstName ?? 'Hôte'}
        </h1>
        <p className="mt-3 text-lg text-ink/50">Voici un aperçu de votre activité aujourd'hui.</p>
      </div>

      {profile ? (
        <HostStripeConnectBanner
          stripe={profile.stripe}
          busy={stripeBusy}
          error={stripeError}
          onStartOnboarding={() => {
            void startStripeOnboarding();
          }}
          onOpenDashboard={() => {
            void openStripeDashboard();
          }}
        />
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="group relative overflow-hidden rounded-2xl border border-ink/8 bg-surface p-8 soft-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-ink/40">Établissements</p>
              <p className="mt-3 font-display text-2xl font-bold text-ink">{propertyLabel}</p>
              {properties.length === 1 ? (
                <p className="mt-1 text-sm text-ink/50">
                  {properties[0].city}, {properties[0].country}
                </p>
              ) : null}
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <FontAwesomeIcon icon="hotel" className="h-5 w-5" />
            </span>
          </div>
          <Link to="/host/property" className="mt-8 inline-block">
            <Button variant={hasProperties ? 'secondary' : 'primary'} size="sm">
              {hasProperties ? 'Gérer mes établissements' : 'Créer mon établissement'}
            </Button>
          </Link>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-ink/8 bg-surface p-8 soft-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-ink/40">
                Chambres publiées
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-ink">{roomsCount}</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mist text-ink/70">
              <FontAwesomeIcon icon="bed" className="h-5 w-5" />
            </span>
          </div>
          <Link to="/host/property" className="mt-8 inline-block">
            <Button variant="secondary" size="sm" disabled={!hasProperties}>
              <FontAwesomeIcon icon="plus" className="mr-2 h-3.5 w-3.5" />
              Voir les établissements
            </Button>
          </Link>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-ink/8 bg-surface p-8 soft-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-ink/40">
                Réservations
              </p>
              <p className="mt-3 font-display text-3xl font-bold text-ink">
                {reservationStats?.totalCount ?? 0}
              </p>
              {reservationStats && reservationStats.pendingCount > 0 ? (
                <p className="mt-1 text-sm font-medium text-amber-600">
                  {reservationStats.pendingCount} en attente
                </p>
              ) : (
                <p className="mt-1 text-sm text-ink/50">
                  {reservationStats?.activeCount ?? 0} séjour
                  {(reservationStats?.activeCount ?? 0) > 1 ? 's' : ''} actif
                  {(reservationStats?.activeCount ?? 0) > 1 ? 's' : ''}
                </p>
              )}
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
              <FontAwesomeIcon icon="calendar-check" className="h-5 w-5" />
            </span>
          </div>
          <Link to="/host/reservations" className="mt-8 inline-block">
            <Button variant="secondary" size="sm">
              Voir les réservations
            </Button>
          </Link>
        </div>

        <HostDashboardStatCard
          icon="chart-line"
          label="Taux d'occupation"
          value={`${Math.round(reservationStats?.occupancyRate ?? 0)} %`}
          accent="bg-brand/10 text-brand"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-2xl border border-ink/8 bg-surface p-8 soft-shadow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">Activité récente</h2>
              <p className="mt-1 text-sm text-ink/50">Vos dernières réservations confirmées.</p>
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

        <div className="space-y-6">
          <HostDashboardStatCard
            icon="euro-sign"
            label="Revenus du mois"
            value={formatHostCurrency(reservationStats?.monthlyRevenue ?? 0)}
            accent="bg-brand/10 text-brand"
          />
          <HostDashboardStatCard
            icon="chart-line"
            label="Revenu total"
            value={formatHostCurrency(reservationStats?.totalRevenue ?? 0)}
            accent="bg-brand/10 text-brand"
          />
        </div>
      </div>

      {!hasProperties ? (
        <div className="rounded-2xl border border-dashed border-brand/30 bg-brand/5 p-8">
          <h2 className="font-display text-xl font-bold text-ink">Commencez ici</h2>
          <p className="mt-2 text-ink/70">
            Créez d&apos;abord votre établissement, puis ajoutez vos chambres pour les rendre visibles
            sur le site public.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default HostDashboardPage;
