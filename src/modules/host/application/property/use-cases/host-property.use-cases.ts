import type { PropertyFormPayload } from '../../../core/types/host.types';
import type { HostPropertyRepository } from '../ports/host-property.repository';

export class GetHostProfileUseCase {
  constructor(private readonly hostPropertyRepository: HostPropertyRepository) {}

  execute() {
    return this.hostPropertyRepository.getProfile();
  }
}

export class ListHostPropertiesUseCase {
  constructor(private readonly hostPropertyRepository: HostPropertyRepository) {}

  execute() {
    return this.hostPropertyRepository.listProperties();
  }
}

export class GetHostPropertyUseCase {
  constructor(private readonly hostPropertyRepository: HostPropertyRepository) {}

  execute(propertyId: number) {
    return this.hostPropertyRepository.getProperty(propertyId);
  }
}

export class CreateHostPropertyUseCase {
  constructor(private readonly hostPropertyRepository: HostPropertyRepository) {}

  execute(payload: PropertyFormPayload) {
    return this.hostPropertyRepository.createProperty(payload);
  }
}

export class UpdateHostPropertyUseCase {
  constructor(private readonly hostPropertyRepository: HostPropertyRepository) {}

  execute(propertyId: number, payload: PropertyFormPayload) {
    return this.hostPropertyRepository.updateProperty(propertyId, payload);
  }
}
