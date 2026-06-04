import type { PaginatedResponse } from './types';

export function parsePaginatedResponse<T>(
  data: unknown,
  mapItem: (item: unknown) => T | null,
): PaginatedResponse<T> {
  if (!data || typeof data !== 'object') {
    return {
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }

  const record = data as Record<string, unknown>;
  const metaRecord =
    record.meta && typeof record.meta === 'object'
      ? (record.meta as Record<string, unknown>)
      : {};

  const items = Array.isArray(record.data)
    ? record.data
        .map(mapItem)
        .filter((item): item is T => item !== null)
    : [];

  return {
    data: items,
    meta: {
      page: typeof metaRecord.page === 'number' ? metaRecord.page : 1,
      limit: typeof metaRecord.limit === 'number' ? metaRecord.limit : 12,
      total: typeof metaRecord.total === 'number' ? metaRecord.total : items.length,
      totalPages:
        typeof metaRecord.totalPages === 'number' ? metaRecord.totalPages : 0,
    },
  };
}
