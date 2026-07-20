import type {
  HostProfile,
  HostProperty,
  PropertyFormPayload,
} from '../../../core/types/host.types';

export type PropertyMutationResult =
  | { success: true; property: HostProperty }
  | { success: false; error: string };

export interface HostPropertyRepository {
  getProfile(): Promise<HostProfile | null>;
  listProperties(): Promise<HostProperty[]>;
  getProperty(propertyId: number): Promise<HostProperty | null>;
  createProperty(payload: PropertyFormPayload): Promise<PropertyMutationResult>;
  updateProperty(
    propertyId: number,
    payload: PropertyFormPayload,
  ): Promise<PropertyMutationResult>;
}
