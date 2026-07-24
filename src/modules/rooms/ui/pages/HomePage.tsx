import { Link } from 'react-router';
import { useNavigate } from 'react-router';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import { EmptyState, InlineErrorPanel, PageContainer, RoomGridSkeleton } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { useRoomsList } from '../hooks/useRoomsList';
import { useRoomTypeOptions } from '../hooks/useRoomTypeOptions';
import RoomGrid from '../components/RoomGrid';
import RoomSearchBar from '../components/RoomSearchBar';
import HomeCategoryNav from '../components/home/HomeCategoryNav';
import HomeDestinationLinks from '../components/home/HomeDestinationLinks';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=80';

const HomePage = () => {
  usePageTitle('Accueil');
  const navigate = useNavigate();
  const { roomTypes } = useRoomTypeOptions();
  const { result, loading, error } = useRoomsList({ page: 1, limit: 10, status: 'available' });
  const featuredRooms = result.data.slice(0, 8);

  const handleNearMeClick = () => {
    if (!navigator.geolocation) {
      navigate('/search');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const params = new URLSearchParams({
          lat: String(position.coords.latitude),
          lng: String(position.coords.longitude),
          radiusKm: '25',
        });
        navigate(`/search?${params.toString()}`);
      },
      () => {
        navigate('/search');
      },
    );
  };

  return (
    <PublicPageLayout>
      <section className="relative flex min-h-[85vh] items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-ink/55" aria-hidden="true" />

        <div className="relative z-10 w-full px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center text-white">
            <p className="font-display text-5xl font-bold tracking-tight md:text-7xl">airbnb</p>
            <h1 className="mt-6 font-display text-3xl font-bold tracking-tight md:text-5xl">
              Trouvez votre prochain séjour
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">
              Des logements uniques, partout dans le monde — réservez en quelques clics.
            </p>
            <div className="mx-auto mt-10 max-w-4xl">
              <RoomSearchBar />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-surface py-8">
        <PageContainer>
          <HomeCategoryNav roomTypes={roomTypes} onNearMeClick={handleNearMeClick} />
        </PageContainer>
      </section>

      <section className="page-mist py-12 md:py-16">
        <PageContainer>
          <h2 className="mb-8 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Logements à la une
          </h2>

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
              className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white transition duration-200 hover:bg-brand-dark"
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
