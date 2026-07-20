export function parseApiError(data: unknown, fallback: string): string {
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.message === 'string') {
      return record.message;
    }
    if (Array.isArray(record.message)) {
      return record.message.map(String).join(', ');
    }
  }

  return fallback;
}

export function extractApiToken(data: unknown): string | null {
  if (
    data &&
    typeof data === 'object' &&
    typeof (data as Record<string, unknown>).token === 'string'
  ) {
    return (data as Record<string, unknown>).token as string;
  }

  return null;
}

export function isSafeInternalRedirect(path: string | null | undefined): path is string {
  return Boolean(path && path.startsWith('/') && !path.startsWith('//'));
}
