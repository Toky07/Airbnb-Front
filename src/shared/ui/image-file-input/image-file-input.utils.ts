import { resolveAvatarUrl } from '../avatar-url';
import type { ImagePreviewItem } from './types';

export const DEFAULT_IMAGE_ACCEPT =
  'image/jpeg,image/png,image/webp,image/gif';

export function createPreviewId(): string {
  return crypto.randomUUID();
}

export function toPreviewUrl(source: string): string {
  return resolveAvatarUrl(source) ?? source;
}

export function normalizeSingleValue(value?: string): string[] {
  if (!value) {
    return [];
  }
  return [value];
}

export function normalizeMultipleValue(value?: string[]): string[] {
  if (!value?.length) {
    return [];
  }
  return value.filter(Boolean);
}

/** Évite de réinitialiser l’aperçu quand `value={[]}` recrée un tableau à chaque render. */
export function areImageSourcesEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((source, index) => source === b[index]);
}

export function resolveMaxFiles(multiple: boolean, maxFiles?: number): number {
  if (typeof maxFiles === 'number' && maxFiles > 0) {
    return maxFiles;
  }
  return multiple ? 10 : 1;
}

export function canAddFiles(
  currentCount: number,
  incomingCount: number,
  maxFiles: number,
): boolean {
  return currentCount + incomingCount <= maxFiles;
}

export function buildPreviewItems(sources: string[]): ImagePreviewItem[] {
  return sources.map((source) => ({
    id: createPreviewId(),
    source,
    previewUrl: toPreviewUrl(source),
    revokeOnUnmount: false,
  }));
}

export function buildHint(maxSizeMb: number, maxFiles: number, multiple: boolean): string {
  const formats = 'JPG, PNG, WebP ou GIF';
  const size = `max. ${maxSizeMb} Mo`;
  if (multiple) {
    return `${formats} — ${size} — jusqu’à ${maxFiles} fichier${maxFiles > 1 ? 's' : ''}`;
  }
  return `${formats} — ${size}`;
}

export function revokePreviewItems(items: ImagePreviewItem[]): void {
  for (const item of items) {
    if (item.revokeOnUnmount && item.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(item.previewUrl);
    }
  }
}
