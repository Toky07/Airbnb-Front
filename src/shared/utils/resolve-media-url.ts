export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path?.trim()) {
    return null;
  }

  const normalized = path.trim().replace(/\\/g, '/');

  if (
    normalized.startsWith('data:') ||
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('blob:')
  ) {
    return normalized;
  }

  const base = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  const withSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `${base}${withSlash}`;
}
