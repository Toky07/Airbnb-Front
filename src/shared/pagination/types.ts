export const PAGE_SIZE_OPTIONS = [10, 15, 20, 25] as const;

export type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export const DEFAULT_PAGE_SIZE: PageSizeOption = 10;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type ListQueryParams = {
  page?: number;
  limit?: PageSizeOption;
  search?: string;
  propertyId?: number;
  checkIn?: string;
  checkOut?: string;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  roomTypeId?: number;
  amenityIds?: number[];
  city?: string;
  status?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
};
