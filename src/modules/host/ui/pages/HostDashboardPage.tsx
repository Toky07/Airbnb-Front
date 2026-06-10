import { faBed, faCalendarCheck, faHotel, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getHostReservationService, getHostService, type HostReservationStats } from '../../core/services/host.service';
import type { HostProfile } from '../../core/types/host.types';
import { Button } from '../../../../shared/ui';

const HostDashboardPage = () => {
  const [profile, setProfile] = useState<HostProfile | null>(null);
  const [roomsCount, setRoomsCount] = useState(0);
  const [reservationStats, setReservationStats] = useState<HostReservationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const hostService = getHostService();
      const reservationService = getHostReservationService();
      const [profileData, roomsData, statsData] = await Promise.all([
        hostService.getProfile(),
        hostService.listRooms({ page: 1, limit: 10 }),
        reservationService.getStats(),
      ]);
      setProfile(profileData);
      setRoomsCount(roomsData.meta.total);
      setReservationStats(statsData);
      setLoading(false);
    }

    void load();
  }, []);

  if (loading) {
    return <div className="h-64 animate-pulse rounded-3xl border border-slate-100 bg-white p-8 shadow-sm" />;
  }

  const property = profile?.property;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-4xl font-bold text-slate-900">
          Bonjour, {profile?.user.firstName ?? 'Hôte'}
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          Voici un aperçu de votre activité aujourd'hui.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card: Établissement */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Établissement</p>
              <p className="mt-3 font-serif text-2xl font-bold text-slate-900">
                {property?.name ?? 'Non configuré'}
              </p>
              {property ? (
                <p className="mt-1 text-sm text-slate-500">
                  {property.city}, {property.country}
                </p>
              ) : null}
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-brand">
              <FontAwesomeIcon icon={faHotel} className="h-5 w-5" />
            </span>
          </div>
          <Link to="/host/property" className="mt-8 inline-block">
            <Button variant={property ? 'secondary' : 'primary'} size="sm">
              {property ? "Modifier l'établissement" : 'Créer mon établissement'}
            </Button>
          </Link>
        </div>

        {/* Card: Chambres */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Chambres publiées</p>
              <p className="mt-3 font-serif text-3xl font-bold text-slate-900">{roomsCount}</p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <FontAwesomeIcon icon={faBed} className="h-5 w-5" />
            </span>
          </div>
          <Link to="/host/rooms" className="mt-8 inline-block">
            <Button variant="secondary" size="sm" disabled={!property}>
              <FontAwesomeIcon icon={faPlus} className="mr-2 h-3.5 w-3.5" />
              Gérer les chambres
            </Button>
          </Link>
        </div>

        {/* Card: Réservations */}
        <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Réservations</p>
              <p className="mt-3 font-serif text-3xl font-bold text-slate-900">
                {reservationStats?.totalCount ?? 0}
              </p>
              {reservationStats && reservationStats.pendingCount > 0 ? (
                <p className="mt-1 text-sm font-medium text-amber-600">
                  {reservationStats.pendingCount} en attente
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">Toutes confirmées</p>
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
      </div>

      {!property ? (
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
