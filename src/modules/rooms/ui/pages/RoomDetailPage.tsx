import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation, useParams } from 'react-router';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import { PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { getRoomLocation } from '../../core/types/room.types';
import { useRoomDetail } from '../hooks/useRoomDetail';
import RoomAmenities from '../components/RoomAmenities';
import RoomDetailGallery from '../components/RoomDetailGallery';
import RoomBookingPanel from '../../../reservation/ui/components/RoomBookingPanel';
import FavoriteButton from '../../../favorite/ui/components/FavoriteButton';
import RoomReviewsSection from '../../../review/ui/components/RoomReviewsSection';
import { useRoomReviews } from '../../../review/ui/hooks/useRoomReviews';
import { isRoomBookable } from '../../core/types/room.types';

const RoomDetailPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { room, loading, error } = useRoomDetail(slug ?? null);
  const { reviews, summary, loading: reviewsLoading } = useRoomReviews(slug ?? null);
  usePageTitle(room?.name ?? 'Détail du logement');

  return (
    <PublicPageLayout>
      <PageContainer className="page-mist py-8 md:py-12">
        <Link
          to="/search"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink/60 transition duration-200 hover:text-brand"
        >
          <FontAwesomeIcon icon="arrow-left" className="h-3.5 w-3.5" />
          Retour aux logements
        </Link>

        {loading ? (
          <div className="space-y-6">
            <div className="aspect-[16/9] animate-pulse rounded-2xl bg-mist" />
            <div className="h-8 w-1/2 animate-pulse rounded-xl bg-mist" />
            <div className="h-4 w-1/3 animate-pulse rounded-xl bg-mist" />
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="text-lg font-medium text-red-700">{error}</p>
            <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand">
              Retour à l&apos;accueil
            </Link>
          </div>
        ) : null}

        {!loading && room ? (
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-12">
              <RoomDetailGallery room={room} />

              <div className="border-b border-line pb-10">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="mb-4 flex items-center gap-3">
                      <FavoriteButton roomId={room.id} size="sm" />
                      <span className="text-sm font-medium text-ink/60">Enregistrer ce logement</span>
                    </div>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">{room.name}</h1>
                    <p className="mt-4 flex items-center gap-2 text-lg text-ink/60">
                      <FontAwesomeIcon icon="location-dot" className="h-5 w-5 text-brand/80" />
                      {getRoomLocation(room)}
                    </p>
                    {room.property?.address ? (
                      <p className="mt-2 text-ink/50">{room.property.address}</p>
                    ) : null}
                  </div>
                  {room.roomType ? (
                    <span className="rounded-xl bg-mist px-4 py-2 text-sm font-semibold tracking-wider text-ink/80 uppercase">
                      {room.roomType.name}
                    </span>
                  ) : null}
                </div>

                {room.property?.name ? (
                  <p className="mt-6 text-ink/50">
                    Établissement : <span className="font-medium text-ink">{room.property.name}</span>
                  </p>
                ) : null}
              </div>

              {room.description ? (
                <div className="border-b border-line pb-10">
                  <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-ink">À propos de cette chambre</h2>
                  <p className="whitespace-pre-line text-lg leading-relaxed text-ink/70">{room.description}</p>
                </div>
              ) : null}

              <div className="border-b border-line pb-10">
                <RoomAmenities room={room} />
              </div>

              <RoomReviewsSection
                summary={summary}
                reviews={reviews}
                loading={reviewsLoading}
              />

              {room.property?.description ? (
                <div className="pb-10">
                  <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-ink">L'établissement</h2>
                  <p className="whitespace-pre-line text-lg leading-relaxed text-ink/70">{room.property.description}</p>
                </div>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              {isRoomBookable(room) ? (
                <RoomBookingPanel room={room} returnPath={location.pathname} />
              ) : (
                <div className="surface rounded-2xl p-8 soft-shadow">
                  <p className="text-center text-ink/60">
                    Ce logement n&apos;est pas disponible pour le moment.
                  </p>
                </div>
              )}
            </aside>
          </div>
        ) : null}
      </PageContainer>
    </PublicPageLayout>
  );
};

export default RoomDetailPage;
