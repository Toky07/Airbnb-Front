import { describe, expect, it } from 'vitest';
import { resolveMediaUrl } from './resolve-media-url';

describe('resolveMediaUrl', () => {
  it('préfixe les chemins uploads property/room/avatar', () => {
    expect(resolveMediaUrl('uploads/3/property/cover.jpg')).toContain(
      '/uploads/3/property/cover.jpg',
    );
    expect(resolveMediaUrl('uploads/3/room/5/photo.jpg')).toContain(
      '/uploads/3/room/5/photo.jpg',
    );
    expect(resolveMediaUrl('uploads/users/7/avatar/photo.jpg')).toContain(
      '/uploads/users/7/avatar/photo.jpg',
    );
  });

  it('laisse passer les URLs absolues et data URLs', () => {
    expect(resolveMediaUrl('https://cdn.test/image.jpg')).toBe('https://cdn.test/image.jpg');
    expect(resolveMediaUrl('data:image/png;base64,abc')).toBe('data:image/png;base64,abc');
  });
});
