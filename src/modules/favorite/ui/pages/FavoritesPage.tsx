import { Link } from 'react-router';
import { getButtonClassName } from '../../../../shared/ui/button/button-classes';
import { PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import RoomCard from '../../../rooms/ui/components/RoomCard';
import { useMyFavorites } from '../hooks/useMyFavorites';

const FavoritesPage = () => {
  usePageTitle('Mes favoris');
  const { favorites, loading, error } = useMyFavorites();

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white">
      <PageContainer className="py-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Mon compte</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Mes favoris
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Retrouvez les logements que vous avez enregistrés pour vos prochains séjours.
            </p>
          </div>

          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="aspect-square animate-pulse rounded-xl bg-slate-100" />
              <div className="aspect-square animate-pulse rounded-xl bg-slate-100" />
              <div className="aspect-square animate-pulse rounded-xl bg-slate-100" />
            </div>
          ) : null}

          {error ? (
            <p className="mt-10 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {!loading && !error && favorites.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm">
              <p className="text-lg font-medium text-slate-700">
                Vous n&apos;avez pas encore de favori
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Explorez les logements et enregistrez ceux qui vous plaisent.
              </p>
              <Link
                to="/search"
                className={getButtonClassName('primary', 'md', 'mt-8 inline-flex')}
              >
                Rechercher une chambre
              </Link>
            </div>
          ) : null}

          {!loading && !error && favorites.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((favorite) => (
                <RoomCard key={favorite.id} room={favorite.room} />
              ))}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </div>
  );
};

export default FavoritesPage;
