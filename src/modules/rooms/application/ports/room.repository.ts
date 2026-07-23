import type { ListQueryParams, PaginatedResponse } from '../../../../shared/pagination/types';
import type { PricingBreakdown } from '../../../../shared/pricing/pricing-breakdown.types';
import type { RoomListItem } from '../../core/types/room.types';

export interface RoomRepository {
  list(params?: ListQueryParams): Promise<PaginatedResponse<RoomListItem>>;
  getById(id: number): Promise<RoomListItem | null>;
  getBySlug(slug: string): Promise<RoomListItem | null>;
  getPricingPreview(
    slug: string,
    params: { startDate: string; endDate: string; guestCount: number },
  ): Promise<PricingBreakdown | null>;
}
