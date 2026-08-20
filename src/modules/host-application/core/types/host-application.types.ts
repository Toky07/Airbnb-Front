export const HOST_APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type HostApplicationStatus =
  (typeof HOST_APPLICATION_STATUS)[keyof typeof HOST_APPLICATION_STATUS];

export type HostApplicationApplicant = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type HostApplication = {
  id: number;
  userId: number;
  city: string;
  message: string;
  status: HostApplicationStatus;
  propertyName: string | null;
  reviewComment: string | null;
  reviewedAt: string | null;
  createdAt: string;
  applicant?: HostApplicationApplicant;
};

export type HostApplicationPayload = {
  city: string;
  message: string;
  propertyName?: string;
};

export type HostApplicationMutationResult =
  | { success: true; application: HostApplication }
  | { success: false; error: string };

export const HOST_APPLICATION_MESSAGE_MIN_LENGTH = 30;

export function getHostApplicationStatusLabel(status: HostApplicationStatus): string {
  const labels: Record<HostApplicationStatus, string> = {
    pending: 'En attente',
    approved: 'Acceptée',
    rejected: 'Refusée',
  };
  return labels[status] ?? status;
}
