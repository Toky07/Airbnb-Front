import type {
  HostApplication,
  HostApplicationMutationResult,
  HostApplicationPayload,
} from '../../core/types/host-application.types';

export interface HostApplicationRepository {
  getMine(): Promise<HostApplication | null>;
  submit(payload: HostApplicationPayload): Promise<HostApplicationMutationResult>;
}
