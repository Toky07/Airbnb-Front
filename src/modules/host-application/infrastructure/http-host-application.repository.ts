import type { HttpClient } from '../../../shared/http/ports/http-client';
import { getHttpClient } from '../../../shared/http/composition/http.composition';
import { parseApiError } from '../../../shared/http/parse-api-error';
import type { HostApplicationRepository } from '../application/ports/host-application.repository';
import {
  HOST_APPLICATION_STATUS,
  type HostApplication,
  type HostApplicationPayload,
  type HostApplicationStatus,
} from '../core/types/host-application.types';

function isStatus(value: unknown): value is HostApplicationStatus {
  return (
    value === HOST_APPLICATION_STATUS.PENDING ||
    value === HOST_APPLICATION_STATUS.APPROVED ||
    value === HOST_APPLICATION_STATUS.REJECTED
  );
}

export function mapHostApplication(data: unknown): HostApplication | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (
    typeof record.id !== 'number' ||
    typeof record.userId !== 'number' ||
    typeof record.city !== 'string' ||
    typeof record.message !== 'string' ||
    !isStatus(record.status) ||
    typeof record.createdAt !== 'string'
  ) {
    return null;
  }

  const applicantRaw = record.applicant;
  const applicant =
    applicantRaw && typeof applicantRaw === 'object'
      ? {
          id: Number((applicantRaw as Record<string, unknown>).id),
          firstName: String((applicantRaw as Record<string, unknown>).firstName ?? ''),
          lastName: String((applicantRaw as Record<string, unknown>).lastName ?? ''),
          email: String((applicantRaw as Record<string, unknown>).email ?? ''),
          phoneNumber: String(
            (applicantRaw as Record<string, unknown>).phoneNumber ?? '',
          ),
        }
      : undefined;

  return {
    id: record.id,
    userId: record.userId,
    city: record.city,
    message: record.message,
    status: record.status,
    propertyName:
      typeof record.propertyName === 'string' ? record.propertyName : null,
    reviewComment:
      typeof record.reviewComment === 'string' ? record.reviewComment : null,
    reviewedAt: typeof record.reviewedAt === 'string' ? record.reviewedAt : null,
    createdAt: record.createdAt,
    applicant:
      applicant && Number.isFinite(applicant.id) ? applicant : undefined,
  };
}

export class HttpHostApplicationRepository implements HostApplicationRepository {
  private readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient = getHttpClient()) {
    this.httpClient = httpClient;
  }

  async getMine(): Promise<HostApplication | null> {
    const response = await this.httpClient.get('/host-applications/me');
    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    if (!text.trim() || text.trim() === 'null') {
      return null;
    }

    try {
      return mapHostApplication(JSON.parse(text) as unknown);
    } catch {
      return null;
    }
  }

  async submit(payload: HostApplicationPayload) {
    const response = await this.httpClient.post('/host-applications', payload);
    const data: unknown = await response.json();

    if (!response.ok) {
      return {
        success: false as const,
        error: parseApiError(data, 'Impossible d’envoyer la demande.'),
      };
    }

    const application = mapHostApplication(data);
    if (!application) {
      return {
        success: false as const,
        error: 'Réponse invalide.',
      };
    }

    return { success: true as const, application };
  }
}
