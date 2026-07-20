import type { ListQueryParams } from '../../../../shared/pagination/types';
import type { RoomRepository } from '../ports/room.repository';

export class ListRoomsUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  execute(params: ListQueryParams = {}) {
    return this.roomRepository.list(params);
  }
}

export class GetRoomByIdUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  execute(id: number) {
    return this.roomRepository.getById(id);
  }
}

export class GetRoomBySlugUseCase {
  constructor(private readonly roomRepository: RoomRepository) {}

  execute(slug: string) {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug) {
      return Promise.resolve(null);
    }

    return this.roomRepository.getBySlug(normalizedSlug);
  }
}
