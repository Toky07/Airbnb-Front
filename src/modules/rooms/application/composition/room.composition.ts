import { getHttpClient } from '../../../../shared/http/composition/http.composition';
import type { RoomRepository } from '../ports/room.repository';
import {
  GetRoomByIdUseCase,
  GetRoomBySlugUseCase,
  GetRoomPricingPreviewUseCase,
  ListRoomsUseCase,
} from '../use-cases/room.use-cases';
import { HttpRoomRepository } from '../../infrastructure/http-room.repository';

let roomRepository: RoomRepository | null = null;
let listRoomsUseCase: ListRoomsUseCase | null = null;
let getRoomByIdUseCase: GetRoomByIdUseCase | null = null;
let getRoomBySlugUseCase: GetRoomBySlugUseCase | null = null;
let getRoomPricingPreviewUseCase: GetRoomPricingPreviewUseCase | null = null;

export function getRoomRepository(): RoomRepository {
  if (!roomRepository) {
    roomRepository = new HttpRoomRepository(getHttpClient());
  }
  return roomRepository;
}

export function getListRoomsUseCase(): ListRoomsUseCase {
  if (!listRoomsUseCase) {
    listRoomsUseCase = new ListRoomsUseCase(getRoomRepository());
  }
  return listRoomsUseCase;
}

export function getGetRoomByIdUseCase(): GetRoomByIdUseCase {
  if (!getRoomByIdUseCase) {
    getRoomByIdUseCase = new GetRoomByIdUseCase(getRoomRepository());
  }
  return getRoomByIdUseCase;
}

export function getGetRoomBySlugUseCase(): GetRoomBySlugUseCase {
  if (!getRoomBySlugUseCase) {
    getRoomBySlugUseCase = new GetRoomBySlugUseCase(getRoomRepository());
  }
  return getRoomBySlugUseCase;
}

export function getGetRoomPricingPreviewUseCase(): GetRoomPricingPreviewUseCase {
  if (!getRoomPricingPreviewUseCase) {
    getRoomPricingPreviewUseCase = new GetRoomPricingPreviewUseCase(getRoomRepository());
  }
  return getRoomPricingPreviewUseCase;
}
