import { faBed, faHouse, faLocationDot, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import { PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { useRoomsList } from '../hooks/useRoomsList';
import RoomGrid from '../components/RoomGrid';
import RoomSearchBar from '../components/RoomSearchBar';
import { getRoomLocation } from '../../core/types/room.types';

const HomePage = () => {
  usePageTitle('Accueil');
  const { result, loading, error } = useRoomsList({ page: 1, limit: 10 });
  const featuredRooms = result.data.filter((room) => room.status === 'available').slice(0, 8);

  return (
    <PublicPageLayout>
      <section className="border-b border-slate-200 bg-white pt-8 pb-6">
        <PageContainer>
          <div className="mx-auto max-w-4xl">
            <RoomSearchBar />
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 overflow-x-auto pb-4 text-sm font-medium text-slate-500 hide-scrollbar">
            {[
              { icon: faHouse, label: 'Maisons' },
              { icon: faLocationDot, label: 'Proche de vous' },
              { icon: faBed, label: 'Chambres' },
              { icon: faUsers, label: 'Famille' }
            ].map((category, idx) => (
              <button
                key={category.label}
                className={`flex flex-col items-center gap-2 border-b-2 pb-2 transition-colors ${
                  idx === 0
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <FontAwesomeIcon icon={category.icon} className="h-6 w-6" />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="py-8 md:py-12">
        <PageContainer>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-xl"
                >
                  <div className="aspect-square rounded-xl bg-slate-200" />
                  <div className="mt-3 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                    <div className="h-4 w-1/4 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!loading && error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
              {error}
              <p className="mt-2 text-sm text-red-600">
                Vérifiez que l&apos;API tourne sur {import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}.
              </p>
            </div>
          ) : null}

          {!loading && !error && featuredRooms.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-6 py-16 text-center">
              <p className="text-lg font-medium text-slate-700">Aucun logement disponible</p>
              <p className="mt-2 text-sm text-slate-500">
                Ajoutez des chambres depuis le panneau d&apos;administration.
              </p>
            </div>
          ) : null}

          {!loading && !error && featuredRooms.length > 0 ? (
            <RoomGrid rooms={featuredRooms} />
          ) : null}
          
          <div className="mt-12 text-center">
            <Link
              to="/search"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              Afficher plus
            </Link>
          </div>
        </PageContainer>
      </section>

      {!loading && result.data.length > 0 ? (
        <section className="bg-slate-50 py-12">
          <PageContainer>
            <h2 className="mb-6 text-2xl font-semibold text-slate-900">Inspiration pour vos prochains voyages</h2>
            <div className="flex flex-wrap gap-4">
              {Array.from(
                new Map(
                  result.data
                    .map((room) => {
                      const city = room.property?.city?.trim();
                      if (!city) return null;
                      return [city, getRoomLocation(room)] as const;
                    })
                    .filter((entry): entry is readonly [string, string] => entry !== null),
                ).values(),
              )
                .slice(0, 6)
                .map((location) => (
                  <Link
                    key={location}
                    to={`/search?q=${encodeURIComponent(location.split(',')[0]?.trim() ?? location)}`}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:shadow-sm"
                  >
                    {location}
                  </Link>
                ))}
            </div>
          </PageContainer>
        </section>
      ) : null}
    </PublicPageLayout>
  );
};

export default HomePage;
