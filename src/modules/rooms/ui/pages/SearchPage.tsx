import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import { EmptyState, InlineErrorPanel, PageContainer, RoomGridSkeleton } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { DEFAULT_PAGE_SIZE } from '../../../../shared/pagination/types';
import { useRoomsList } from '../hooks/useRoomsList';
import RoomGrid from '../components/RoomGrid';
import RoomPagination from '../components/RoomPagination';
import RoomSearchBar from '../components/RoomSearchBar';
import RoomTypeFilterBar from '../components/search/RoomTypeFilterBar';
import SearchResultsHeader from '../components/search/SearchResultsHeader';
import type { RoomListItem } from '../../core/types/room.types';

function useSearchFilters(rooms: RoomListItem[], roomType: string) {
  const roomTypes = useMemo(() => {
    const map = new Map<string, string>();
    for (const room of rooms) {
      if (room.roomType) {
        map.set(room.roomType.slug, room.roomType.name);
      }
    }
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    let next = rooms;
    if (roomType) {
      next = next.filter((room) => room.roomType?.slug === roomType);
    }
    return next.filter((room) => room.status === 'available');
  }, [rooms, roomType]);

  return { roomTypes, filteredRooms };
}

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

  const { roomTypes, filteredRooms } = useSearchFilters(result.data, roomType);

  const allTypesSearch = useMemo(() => {
    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    const queryString = params.toString();
    return queryString ? `/search?${queryString}` : '/search';
  }, [query]);

  const buildTypeHref = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    }
    params.set('type', slug);
    params.delete('page');
    return `/search?${params.toString()}`;
  };

  return (
    <PublicPageLayout>
      <PageContainer className="py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <RoomSearchBar initialSearch={query} compact />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <SearchResultsHeader query={query} loading={loading} total={result.meta.total} />
        </div>

        <RoomTypeFilterBar
          roomTypes={roomTypes}
          activeType={roomType}
          allTypesHref={allTypesSearch}
          buildTypeHref={buildTypeHref}
        />

        {loading ? <div className="mt-10"><RoomGridSkeleton variant="search" /></div> : null}

        {!loading && error ? (
          <InlineErrorPanel message={error} className="mt-10" />
        ) : null}

        {!loading && !error && filteredRooms.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="Aucun résultat"
            description="Essayez un autre mot-clé ou parcourez tous les logements."
          />
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
