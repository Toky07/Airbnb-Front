import { Link } from 'react-router';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import { EmptyState, InlineErrorPanel, PageContainer, RoomGridSkeleton } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { useRoomsList } from '../hooks/useRoomsList';
import RoomGrid from '../components/RoomGrid';
import RoomSearchBar from '../components/RoomSearchBar';
import HomeCategoryNav from '../components/home/HomeCategoryNav';
import HomeDestinationLinks from '../components/home/HomeDestinationLinks';

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
          <HomeCategoryNav />
        </PageContainer>
      </section>

      <section className="py-8 md:py-12">
        <PageContainer>
          {loading ? <RoomGridSkeleton /> : null}

          {!loading && error ? (
            <InlineErrorPanel
              message={error}
              hint={`Vérifiez que l'API tourne sur ${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}.`}
            />
          ) : null}

          {!loading && !error && featuredRooms.length === 0 ? (
            <EmptyState
              title="Aucun logement disponible"
              description="Ajoutez des chambres depuis le panneau d'administration."
            />
          ) : null}

          {!loading && !error && featuredRooms.length > 0 ? <RoomGrid rooms={featuredRooms} /> : null}

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

      {!loading && result.data.length > 0 ? <HomeDestinationLinks rooms={result.data} /> : null}
    </PublicPageLayout>
  );
};

export default HomePage;
