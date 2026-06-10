import { describe, expect, it, vi } from 'vitest';
import {
  readImageAsDataUrl,
  readImagesAsDataUrls,
  validateImageFile,
} from './read-image-as-data-url';

function createFile(
  name: string,
  type: string,
  sizeBytes: number,
): File {
  const buffer = new ArrayBuffer(sizeBytes);
  return new File([buffer], name, { type });
}

describe('validateImageFile', () => {
  it('accepte un PNG valide', () => {
    const file = createFile('photo.png', 'image/png', 1024);
    expect(validateImageFile(file)).toBeNull();
  });

  it('rejette un format non supporté', () => {
    const file = createFile('doc.pdf', 'application/pdf', 1024);
    expect(validateImageFile(file)).toContain('Format non supporté');
  });

  it('rejette un fichier trop volumineux', () => {
    const file = createFile('big.png', 'image/png', 6 * 1024 * 1024);
    expect(validateImageFile(file, 5)).toContain('5 Mo');
  });
});

describe('readImageAsDataUrl', () => {
  it('retourne une data URL en cas de succès', async () => {
    const file = createFile('photo.png', 'image/png', 64);

    class MockFileReader {
      result: string | ArrayBuffer | null = 'data:image/png;base64,abc';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL() {
        this.onload?.();
      }
    }

    vi.stubGlobal('FileReader', MockFileReader);

    const result = await readImageAsDataUrl(file);
    expect(result).toEqual({ success: true, dataUrl: 'data:image/png;base64,abc' });

    vi.unstubAllGlobals();
  });

  it('retourne une erreur si la lecture échoue', async () => {
    const file = createFile('photo.png', 'image/png', 64);

    class MockFileReader {
      result: string | ArrayBuffer | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL() {
        this.onerror?.();
      }
    }

    vi.stubGlobal('FileReader', MockFileReader);

    const result = await readImageAsDataUrl(file);
    expect(result.success).toBe(false);

    vi.unstubAllGlobals();
  });
});

describe('readImagesAsDataUrls', () => {
  it('agrège les succès et les erreurs', async () => {
    const valid = createFile('a.png', 'image/png', 64);
    const invalid = createFile('b.pdf', 'application/pdf', 64);

    class MockFileReader {
      result: string | ArrayBuffer | null = 'data:image/png;base64,xyz';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL() {
        this.onload?.();
      }
    }

    vi.stubGlobal('FileReader', MockFileReader);

    const result = await readImagesAsDataUrls([valid, invalid]);
    expect(result.dataUrls).toEqual(['data:image/png;base64,xyz']);
    expect(result.errors).toHaveLength(1);

    vi.unstubAllGlobals();
  });
});
