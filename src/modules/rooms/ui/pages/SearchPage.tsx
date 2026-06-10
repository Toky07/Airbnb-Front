import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import { PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { DEFAULT_PAGE_SIZE } from '../../../../shared/pagination/types';
import { useRoomsList } from '../hooks/useRoomsList';
import RoomGrid from '../components/RoomGrid';
import RoomPagination from '../components/RoomPagination';
import RoomSearchBar from '../components/RoomSearchBar';
import type { RoomListItem } from '../../core/types/room.types';

const SearchPage = () => {
  usePageTitle('Recherche');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() ?? '';
  const roomType = searchParams.get('type')?.trim() ?? '';
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const { result, loading, error } = useRoomsList({
    page,
    limit: DEFAULT_PAGE_SIZE,
    search: query || undefined,
  });

  const roomTypes = useMemo(() => {
    const map = new Map<string, string>();
    for (const room of result.data) {
      if (room.roomType) {
        map.set(room.roomType.slug, room.roomType.name);
      }
    }
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [result.data]);

  const filteredRooms = useMemo(() => {
    let rooms: RoomListItem[] = result.data;

    if (roomType) {
      rooms = rooms.filter((room) => room.roomType?.slug === roomType);
    }

    return rooms.filter((room) => room.status === 'available');
  }, [result.data, roomType]);

  return (
    <PublicPageLayout>
      <PageContainer className="py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <RoomSearchBar initialSearch={query} compact />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {query ? `Résultats pour « ${query} »` : 'Tous les logements'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? 'Chargement…'
                : `${result.meta.total} logement${result.meta.total > 1 ? 's' : ''} trouvé${result.meta.total > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {roomTypes.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="/search"
              className={[
                'rounded-full px-4 py-2 text-sm font-medium transition',
                !roomType
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 text-slate-600 hover:border-slate-300',
              ].join(' ')}
            >
              Tous
            </a>
            {roomTypes.map((type) => {
              const params = new URLSearchParams(searchParams);
              if (query) {
                params.set('q', query);
              }
              params.set('type', type.slug);
              params.delete('page');
              return (
                <a
                  key={type.slug}
                  href={`/search?${params.toString()}`}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    roomType === type.slug
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 text-slate-600 hover:border-slate-300',
                  ].join(' ')}
                >
                  {type.name}
                </a>
              );
            })}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200">
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
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error && filteredRooms.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 px-6 py-16 text-center">
            <p className="text-lg font-medium text-slate-700">Aucun résultat</p>
            <p className="mt-2 text-sm text-slate-500">
              Essayez un autre mot-clé ou parcourez tous les logements.
            </p>
          </div>
        ) : null}

        {!loading && !error && filteredRooms.length > 0 ? (
          <>
            <div className="mt-10">
              <RoomGrid rooms={filteredRooms} />
            </div>
            <RoomPagination page={result.meta.page} totalPages={result.meta.totalPages} />
          </>
        ) : null}
      </PageContainer>
    </PublicPageLayout>
  );
};

export default SearchPage;
