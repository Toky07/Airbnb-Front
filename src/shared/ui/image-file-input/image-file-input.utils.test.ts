import { describe, expect, it, vi } from 'vitest';
import {
  areImageSourcesEqual,
  buildHint,
  canAddFiles,
  normalizeMultipleValue,
  normalizeSingleValue,
  resolveMaxFiles,
} from './image-file-input.utils';

describe('image-file-input.utils', () => {
  it('normalise une valeur simple', () => {
    expect(normalizeSingleValue('')).toEqual([]);
    expect(normalizeSingleValue('data:image/png;base64,x')).toEqual([
      'data:image/png;base64,x',
    ]);
  });

  it('normalise une liste multiple', () => {
    expect(normalizeMultipleValue(['a', '', 'b'])).toEqual(['a', 'b']);
    expect(normalizeMultipleValue(undefined)).toEqual([]);
  });

  it('compare les sources d’images par contenu', () => {
    expect(areImageSourcesEqual([], [])).toBe(true);
    expect(areImageSourcesEqual([], ['a'])).toBe(false);
    expect(areImageSourcesEqual(['a'], ['a'])).toBe(true);
    expect(areImageSourcesEqual(['a'], ['b'])).toBe(false);
  });

  it('résout le nombre max de fichiers', () => {
    expect(resolveMaxFiles(false)).toBe(1);
    expect(resolveMaxFiles(true)).toBe(10);
    expect(resolveMaxFiles(true, 5)).toBe(5);
  });

  it('vérifie si des fichiers peuvent être ajoutés', () => {
    expect(canAddFiles(0, 1, 1)).toBe(true);
    expect(canAddFiles(1, 1, 1)).toBe(false);
    expect(canAddFiles(2, 1, 5)).toBe(true);
    expect(canAddFiles(5, 1, 5)).toBe(false);
  });

  it('génère un hint adapté au mode', () => {
    expect(buildHint(5, 1, false)).toContain('5 Mo');
    expect(buildHint(5, 3, true)).toContain('3 fichiers');
  });

  it('crée un identifiant unique', async () => {
    const { createPreviewId } = await import('./image-file-input.utils');
    vi.stubGlobal('crypto', { randomUUID: () => 'uuid-test' });
    expect(createPreviewId()).toBe('uuid-test');
    vi.unstubAllGlobals();
  });
});
