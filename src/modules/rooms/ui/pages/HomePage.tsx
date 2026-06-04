import { Link } from 'react-router';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import { PageContainer } from '../../../../shared/ui';
import { useRoomsList } from '../hooks/useRoomsList';
import RoomGrid from '../components/RoomGrid';
import RoomSearchBar from '../components/RoomSearchBar';
import { getRoomLocation } from '../../core/types/room.types';

const HomePage = () => {
  const { result, loading, error } = useRoomsList({ page: 1, limit: 10 });
  const featuredRooms = result.data.filter((room) => room.status === 'available').slice(0, 8);

  return (
    <PublicPageLayout>
      <section className="border-b border-slate-200 bg-gradient-to-b from-rose-50 to-white">
        <PageContainer className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand">
              Séjours en direct depuis votre catalogue
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Trouvez votre prochain logement
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Parcourez les chambres et établissements gérés depuis votre back-office.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <RoomSearchBar />
          </div>
        </PageContainer>
      </section>

      <section className="py-12 md:py-16">
        <PageContainer>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Logements disponibles</h2>
              <p className="mt-1 text-slate-500">
                Données synchronisées avec l&apos;API en temps réel.
              </p>
            </div>
            <Link
              to="/search"
              className="text-sm font-semibold text-brand hover:text-brand-dark"
            >
              Voir tout →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-200"
                >
                  <div className="aspect-[4/3] bg-slate-100" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 rounded bg-slate-100" />
                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {!loading && error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
              {error}
              <p className="mt-2 text-sm text-red-600">
                Vérifiez que l&apos;API tourne sur {import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}.
              </p>
            </div>
          ) : null}

          {!loading && !error && featuredRooms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center">
              <p className="text-lg font-medium text-slate-700">Aucun logement disponible</p>
              <p className="mt-2 text-sm text-slate-500">
                Ajoutez des chambres depuis le panneau d&apos;administration.
              </p>
            </div>
          ) : null}

          {!loading && !error && featuredRooms.length > 0 ? (
            <RoomGrid rooms={featuredRooms} />
          ) : null}
        </PageContainer>
      </section>

      {!loading && result.data.length > 0 ? (
        <section className="border-t border-slate-200 bg-slate-50 py-12">
          <PageContainer>
            <h2 className="mb-6 text-xl font-bold text-slate-900">Destinations populaires</h2>
            <div className="flex flex-wrap gap-3">
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
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand hover:text-brand"
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
