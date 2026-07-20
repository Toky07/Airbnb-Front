import type { HostPropertyRepository } from '../ports/host-property.repository';
import {
  CreateHostPropertyUseCase,
  GetHostProfileUseCase,
  GetHostPropertyUseCase,
  ListHostPropertiesUseCase,
  UpdateHostPropertyUseCase,
} from '../use-cases/host-property.use-cases';
import { HttpHostPropertyRepository } from '../../../infrastructure/property/http-host-property.repository';

let hostPropertyRepository: HostPropertyRepository | null = null;
let getHostProfileUseCase: GetHostProfileUseCase | null = null;
let listHostPropertiesUseCase: ListHostPropertiesUseCase | null = null;
let getHostPropertyUseCase: GetHostPropertyUseCase | null = null;
let createHostPropertyUseCase: CreateHostPropertyUseCase | null = null;
let updateHostPropertyUseCase: UpdateHostPropertyUseCase | null = null;

export function getHostPropertyRepository(): HostPropertyRepository {
  if (!hostPropertyRepository) {
    hostPropertyRepository = new HttpHostPropertyRepository();
  }
  return hostPropertyRepository;
}

export function getGetHostProfileUseCase(): GetHostProfileUseCase {
  if (!getHostProfileUseCase) {
    getHostProfileUseCase = new GetHostProfileUseCase(getHostPropertyRepository());
  }
  return getHostProfileUseCase;
}

export function getListHostPropertiesUseCase(): ListHostPropertiesUseCase {
  if (!listHostPropertiesUseCase) {
    listHostPropertiesUseCase = new ListHostPropertiesUseCase(getHostPropertyRepository());
  }
  return listHostPropertiesUseCase;
}

export function getGetHostPropertyUseCase(): GetHostPropertyUseCase {
  if (!getHostPropertyUseCase) {
    getHostPropertyUseCase = new GetHostPropertyUseCase(getHostPropertyRepository());
  }
  return getHostPropertyUseCase;
}

export function getCreateHostPropertyUseCase(): CreateHostPropertyUseCase {
  if (!createHostPropertyUseCase) {
    createHostPropertyUseCase = new CreateHostPropertyUseCase(getHostPropertyRepository());
  }
  return createHostPropertyUseCase;
}

export function getUpdateHostPropertyUseCase(): UpdateHostPropertyUseCase {
  if (!updateHostPropertyUseCase) {
    updateHostPropertyUseCase = new UpdateHostPropertyUseCase(getHostPropertyRepository());
  }
  return updateHostPropertyUseCase;
}
