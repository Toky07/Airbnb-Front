import { getHttpClient } from '../../../../../shared/http/composition/http.composition';
import type { HostRateOverrideRepository } from '../ports/host-rate-override.repository';
import {
  CreateHostRoomRateOverrideUseCase,
  DeleteHostRoomRateOverrideUseCase,
  ListHostRoomRateOverridesUseCase,
} from '../use-cases/host-rate-override.use-cases';
import { HttpHostRateOverrideRepository } from '../../../infrastructure/rate-override/http-host-rate-override.repository';

let repository: HostRateOverrideRepository | null = null;
let listUseCase: ListHostRoomRateOverridesUseCase | null = null;
let createUseCase: CreateHostRoomRateOverrideUseCase | null = null;
let deleteUseCase: DeleteHostRoomRateOverrideUseCase | null = null;

function getRepository(): HostRateOverrideRepository {
  if (!repository) {
    repository = new HttpHostRateOverrideRepository(getHttpClient());
  }
  return repository;
}

export function getListHostRoomRateOverridesUseCase(): ListHostRoomRateOverridesUseCase {
  if (!listUseCase) {
    listUseCase = new ListHostRoomRateOverridesUseCase(getRepository());
  }
  return listUseCase;
}

export function getCreateHostRoomRateOverrideUseCase(): CreateHostRoomRateOverrideUseCase {
  if (!createUseCase) {
    createUseCase = new CreateHostRoomRateOverrideUseCase(getRepository());
  }
  return createUseCase;
}

export function getDeleteHostRoomRateOverrideUseCase(): DeleteHostRoomRateOverrideUseCase {
  if (!deleteUseCase) {
    deleteUseCase = new DeleteHostRoomRateOverrideUseCase(getRepository());
  }
  return deleteUseCase;
}
