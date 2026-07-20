import type { PropertyFormPayload } from '../../../core/types/host.types';
import type { HostPropertyRepository } from '../ports/host-property.repository';

export class GetHostProfileUseCase {
  private readonly hostPropertyRepository: HostPropertyRepository;

  constructor(hostPropertyRepository: HostPropertyRepository) {
    this.hostPropertyRepository = hostPropertyRepository;
  }

  execute() {
    return this.hostPropertyRepository.getProfile();
  }
}

export class ListHostPropertiesUseCase {
  private readonly hostPropertyRepository: HostPropertyRepository;

  constructor(hostPropertyRepository: HostPropertyRepository) {
    this.hostPropertyRepository = hostPropertyRepository;
  }

  execute() {
    return this.hostPropertyRepository.listProperties();
  }
}

export class GetHostPropertyUseCase {
  private readonly hostPropertyRepository: HostPropertyRepository;

  constructor(hostPropertyRepository: HostPropertyRepository) {
    this.hostPropertyRepository = hostPropertyRepository;
  }

  execute(propertyId: number) {
    return this.hostPropertyRepository.getProperty(propertyId);
  }
}

export class CreateHostPropertyUseCase {
  private readonly hostPropertyRepository: HostPropertyRepository;

  constructor(hostPropertyRepository: HostPropertyRepository) {
    this.hostPropertyRepository = hostPropertyRepository;
  }

  execute(payload: PropertyFormPayload) {
    return this.hostPropertyRepository.createProperty(payload);
  }
}

export class UpdateHostPropertyUseCase {
  private readonly hostPropertyRepository: HostPropertyRepository;

  constructor(hostPropertyRepository: HostPropertyRepository) {
    this.hostPropertyRepository = hostPropertyRepository;
  }

  execute(propertyId: number, payload: PropertyFormPayload) {
    return this.hostPropertyRepository.updateProperty(propertyId, payload);
  }
}
