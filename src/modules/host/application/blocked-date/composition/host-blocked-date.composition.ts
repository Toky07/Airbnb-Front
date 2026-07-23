import { getHttpClient } from '../../../../../shared/http/composition/http.composition';
import type { HostBlockedDateRepository } from '../ports/host-blocked-date.repository';
import {
  CreateHostRoomBlockedDateUseCase,
  DeleteHostRoomBlockedDateUseCase,
  ListHostRoomBlockedDatesUseCase,
} from '../use-cases/host-blocked-date.use-cases';
import { HttpHostBlockedDateRepository } from '../../../infrastructure/blocked-date/http-host-blocked-date.repository';

let repository: HostBlockedDateRepository | null = null;
let listUseCase: ListHostRoomBlockedDatesUseCase | null = null;
let createUseCase: CreateHostRoomBlockedDateUseCase | null = null;
let deleteUseCase: DeleteHostRoomBlockedDateUseCase | null = null;

function getRepository(): HostBlockedDateRepository {
  if (!repository) {
    repository = new HttpHostBlockedDateRepository(getHttpClient());
  }
  return repository;
}

export function getListHostRoomBlockedDatesUseCase(): ListHostRoomBlockedDatesUseCase {
  if (!listUseCase) {
    listUseCase = new ListHostRoomBlockedDatesUseCase(getRepository());
  }
  return listUseCase;
}

export function getCreateHostRoomBlockedDateUseCase(): CreateHostRoomBlockedDateUseCase {
  if (!createUseCase) {
    createUseCase = new CreateHostRoomBlockedDateUseCase(getRepository());
  }
  return createUseCase;
}

export function getDeleteHostRoomBlockedDateUseCase(): DeleteHostRoomBlockedDateUseCase {
  if (!deleteUseCase) {
    deleteUseCase = new DeleteHostRoomBlockedDateUseCase(getRepository());
  }
  return deleteUseCase;
}
