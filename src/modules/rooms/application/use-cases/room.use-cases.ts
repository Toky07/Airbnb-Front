import type { ListQueryParams } from '../../../../shared/pagination/types';
import type { RoomRepository } from '../ports/room.repository';

export class ListRoomsUseCase {
  private readonly roomRepository: RoomRepository;

  constructor(roomRepository: RoomRepository) {
    this.roomRepository = roomRepository;
  }

  execute(params: ListQueryParams = {}) {
    return this.roomRepository.list(params);
  }
}

export class GetRoomByIdUseCase {
  private readonly roomRepository: RoomRepository;

  constructor(roomRepository: RoomRepository) {
    this.roomRepository = roomRepository;
  }

  execute(id: number) {
    return this.roomRepository.getById(id);
  }
}

export class GetRoomBySlugUseCase {
  private readonly roomRepository: RoomRepository;

  constructor(roomRepository: RoomRepository) {
    this.roomRepository = roomRepository;
  }

  execute(slug: string) {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug) {
      return Promise.resolve(null);
    }

    return this.roomRepository.getBySlug(normalizedSlug);
  }
}

export class GetRoomPricingPreviewUseCase {
  private readonly roomRepository: RoomRepository;

  constructor(roomRepository: RoomRepository) {
    this.roomRepository = roomRepository;
  }

  execute(
    slug: string,
    params: { startDate: string; endDate: string; guestCount: number },
  ) {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug || !params.startDate || !params.endDate) {
      return Promise.resolve(null);
    }

    return this.roomRepository.getPricingPreview(normalizedSlug, params);
  }
}
