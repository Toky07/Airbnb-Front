import { DEFAULT_PAGE_SIZE, type ListQueryParams } from './types';

export function buildListQuery(params: ListQueryParams = {}): string {
  const search = new URLSearchParams();
  search.set('page', String(params.page ?? 1));
  search.set('limit', String(params.limit ?? DEFAULT_PAGE_SIZE));

  const trimmed = params.search?.trim();
  if (trimmed) {
    search.set('search', trimmed);
  }

  if (params.propertyId !== undefined && params.propertyId > 0) {
    search.set('propertyId', String(params.propertyId));
  }

  return `?${search.toString()}`;
}
