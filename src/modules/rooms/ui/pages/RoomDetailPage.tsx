import { faArrowLeft, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation, useParams } from 'react-router';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import { PageContainer } from '../../../../shared/ui';
import { getRoomLocation } from '../../core/types/room.types';
import { useRoomDetail } from '../hooks/useRoomDetail';
import RoomAmenities from '../components/RoomAmenities';
import RoomDetailGallery from '../components/RoomDetailGallery';
import RoomBookingPanel from '../../../reservation/ui/components/RoomBookingPanel';
import { isRoomBookable } from '../../core/types/room.types';

const RoomDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const roomId = Number.parseInt(id ?? '', 10);
  const { room, loading, error } = useRoomDetail(Number.isFinite(roomId) ? roomId : null);

  return (
    <PublicPageLayout>
      <PageContainer className="py-8 md:py-12">
        <Link
          to="/search"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
          Retour aux logements
        </Link>

        {loading ? (
          <div className="space-y-6">
            <div className="aspect-[16/9] animate-pulse rounded-3xl bg-slate-100" />
            <div className="h-8 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
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
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-8">
              <RoomDetailGallery room={room} />

              <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{room.name}</h1>
                    <p className="mt-2 flex items-center gap-2 text-slate-600">
                      <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4" />
                      {getRoomLocation(room)}
                    </p>
                    {room.property?.address ? (
                      <p className="mt-1 text-sm text-slate-500">{room.property.address}</p>
                    ) : null}
                  </div>
                  {room.roomType ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                      {room.roomType.name}
                    </span>
                  ) : null}
                </div>

                {room.property?.name ? (
                  <p className="mt-4 text-sm text-slate-500">
                    Établissement : <span className="font-medium text-slate-700">{room.property.name}</span>
                  </p>
                ) : null}
              </div>

              {room.description ? (
                <div>
                  <h2 className="mb-3 text-lg font-semibold text-slate-900">Description</h2>
                  <p className="whitespace-pre-line text-slate-600">{room.description}</p>
                </div>
              ) : null}

              <RoomAmenities room={room} />

              {room.property?.description ? (
                <div>
                  <h2 className="mb-3 text-lg font-semibold text-slate-900">À propos de l&apos;établissement</h2>
                  <p className="whitespace-pre-line text-slate-600">{room.property.description}</p>
                </div>
              ) : null}
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              {isRoomBookable(room) ? (
                <RoomBookingPanel room={room} returnPath={location.pathname} />
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
                  <p className="text-center text-sm text-slate-500">
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
