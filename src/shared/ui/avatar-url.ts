import { resolveMediaUrl } from '../utils/resolve-media-url';

export function resolveAvatarUrl(avatar: string): string | null {
  return resolveMediaUrl(avatar);
}
