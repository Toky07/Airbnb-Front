import { useEffect, useMemo, useState } from 'react';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';
import { EmptyState, InlineErrorPanel, PageContainer, RoomGridSkeleton } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import { DEFAULT_PAGE_SIZE } from '../../../../shared/pagination/types';
import { useRoomsList } from '../hooks/useRoomsList';
import { buildRoomListParams, useSearchQueryParams } from '../hooks/useSearchQueryParams';
import { useRoomTypeOptions } from '../hooks/useRoomTypeOptions';
import RoomGrid from '../components/RoomGrid';
import RoomPagination from '../components/RoomPagination';
import RoomSearchBar from '../components/RoomSearchBar';
import RoomTypeFilterBar from '../components/search/RoomTypeFilterBar';
import SearchResultsHeader from '../components/search/SearchResultsHeader';
import AdvancedFiltersPanel from '../components/search/AdvancedFiltersPanel';
import SearchMapView from '../components/search/SearchMapView';

type SearchViewMode = 'list' | 'split' | 'map';

function resolveInitialViewMode(hasGeoSearch: boolean): SearchViewMode {
  return hasGeoSearch ? 'split' : 'list';
}

const SearchPage = () => {
  usePageTitle('Recherche');
  const searchState = useSearchQueryParams();
  const { roomTypes } = useRoomTypeOptions();
  const hasGeoSearch =
    searchState.lat !== undefined && searchState.lng !== undefined;
  const [viewMode, setViewMode] = useState<SearchViewMode>(() =>
    resolveInitialViewMode(hasGeoSearch),
  );

  useEffect(() => {
    if (hasGeoSearch) {
      setViewMode((current) => (current === 'list' ? 'split' : current));
    }
  }, [hasGeoSearch, searchState.lat, searchState.lng]);

  const listParams = useMemo(
    () => buildRoomListParams(searchState, DEFAULT_PAGE_SIZE),
    [searchState],
  );

  const { result, loading, error } = useRoomsList(listParams);
  const mapCenter = hasGeoSearch
    ? { lat: searchState.lat!, lng: searchState.lng! }
    : null;
  const mapRadiusKm = hasGeoSearch ? (searchState.radiusKm ?? 25) : undefined;
  const showList = viewMode === 'list' || viewMode === 'split';
  const showMap = viewMode === 'map' || viewMode === 'split';

  const baseSearchParams = useMemo(() => {
    const params = new URLSearchParams(searchState.searchParams);
    if (searchState.query) {
      params.set('q', searchState.query);
    }
    if (searchState.hasDateRange) {
      params.set('checkIn', searchState.checkIn);
      params.set('checkOut', searchState.checkOut);
    }
    return params;
  }, [searchState]);

  const allTypesSearch = useMemo(() => {
    const params = new URLSearchParams(baseSearchParams);
    params.delete('roomTypeId');
    params.delete('type');
    params.delete('page');
    const queryString = params.toString();
    return queryString ? `/search?${queryString}` : '/search';
  }, [baseSearchParams]);

  const buildTypeHref = (roomTypeId: number) => {
    const params = new URLSearchParams(baseSearchParams);
    params.set('roomTypeId', String(roomTypeId));
    params.delete('type');
    params.delete('page');
    return `/search?${params.toString()}`;
  };

  const viewModeOptions: Array<{ value: SearchViewMode; label: string }> = [
    { value: 'list', label: 'Liste' },
    { value: 'split', label: 'Liste + carte' },
    { value: 'map', label: 'Carte' },
  ];

  return (
    <PublicPageLayout>
      <PageContainer className="page-mist py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <RoomSearchBar
            initialSearch={searchState.query}
            initialCheckIn={searchState.hasDateRange ? searchState.checkIn : ''}
            initialCheckOut={searchState.hasDateRange ? searchState.checkOut : ''}
            compact
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <SearchResultsHeader query={searchState.query} loading={loading} total={result.meta.total} />

          <div
            className="inline-flex rounded-xl border border-line bg-surface p-1 soft-shadow"
            role="group"
            aria-label="Mode d'affichage"
          >
            {viewModeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={viewMode === option.value}
                onClick={() => setViewMode(option.value)}
                className={[
                  'rounded-lg px-3 py-2 text-sm font-medium transition duration-200',
                  viewMode === option.value
                    ? 'bg-brand text-white'
                    : 'text-ink/60 hover:bg-mist hover:text-ink',
                ].join(' ')}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <AdvancedFiltersPanel
          initialMinPrice={searchState.minPrice}
          initialMaxPrice={searchState.maxPrice}
          initialMinGuests={searchState.minGuests}
          initialCity={searchState.city}
          initialAmenityIds={searchState.amenityIds ?? []}
          baseSearchParams={baseSearchParams}
        />

        <RoomTypeFilterBar
          roomTypes={roomTypes}
          activeRoomTypeId={searchState.roomTypeId}
          allTypesHref={allTypesSearch}
          buildTypeHref={buildTypeHref}
        />

        {loading ? <div className="mt-10"><RoomGridSkeleton variant="search" /></div> : null}

        {!loading && error ? (
          <InlineErrorPanel message={error} className="mt-10" />
        ) : null}

        {!loading && !error && result.data.length === 0 ? (
          <EmptyState
            className="mt-10"
            title="Aucun résultat"
            description="Essayez un autre mot-clé, d’autres dates, ou parcourez tous les logements."
          />
        ) : null}

        {!loading && !error && result.data.length > 0 ? (
          <div
            className={[
              'mt-10',
              showList && showMap ? 'grid gap-8 lg:grid-cols-2' : '',
            ].join(' ')}
          >
            {showList ? (
              <div>
                <RoomGrid rooms={result.data} />
                <RoomPagination page={result.meta.page} totalPages={result.meta.totalPages} />
              </div>
            ) : null}

            {showMap ? (
              <SearchMapView
                rooms={result.data}
                center={mapCenter}
                radiusKm={mapRadiusKm}
                className={showList ? 'sticky top-4 h-[min(70vh,640px)]' : 'h-[min(70vh,720px)]'}
              />
            ) : null}
          </div>
        ) : null}
      </PageContainer>
    </PublicPageLayout>
  );
};

export default SearchPage;
