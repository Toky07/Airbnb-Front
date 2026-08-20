export function getAdminPublicUrl(): string {
  const raw = import.meta.env.VITE_ADMIN_PUBLIC_URL as string | undefined;
  return (raw?.trim() || 'http://localhost:5174').replace(/\/$/, '');
}

export const SITE_PATHS = {
  help: '/help',
  contact: '/contact',
  terms: '/legal/cgu',
  privacy: '/legal/confidentialite',
  legalNotice: '/legal/mentions',
} as const;
