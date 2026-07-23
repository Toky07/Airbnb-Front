import type { HostProperty } from '../types/host.types';

export type PropertyMutationResult =
  | { success: true; property: HostProperty }
  | { success: false; error: string };
