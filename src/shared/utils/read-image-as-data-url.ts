const DEFAULT_MAX_SIZE_MB = 5;

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export type ImageReadResult =
  | { success: true; dataUrl: string }
  | { success: false; error: string };

export type ReadImagesResult = {
  dataUrls: string[];
  errors: string[];
};

export function validateImageFile(
  file: File,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
): string | null {
  if (!allowedMimeTypes.has(file.type)) {
    return 'Format non supporté. Utilisez JPG, PNG, WebP ou GIF.';
  }

  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return `L’image ne doit pas dépasser ${maxSizeMb} Mo.`;
  }

  return null;
}

export function readImageAsDataUrl(
  file: File,
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
): Promise<ImageReadResult> {
  const validationError = validateImageFile(file, maxSizeMb);
  if (validationError) {
    return Promise.resolve({ success: false, error: validationError });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve({ success: true, dataUrl: reader.result });
        return;
      }
      resolve({ success: false, error: 'Impossible de lire l’image.' });
    };

    reader.onerror = () => {
      resolve({ success: false, error: 'Impossible de lire l’image.' });
    };

    reader.readAsDataURL(file);
  });
}

export async function readImagesAsDataUrls(
  files: File[],
  maxSizeMb = DEFAULT_MAX_SIZE_MB,
): Promise<ReadImagesResult> {
  const dataUrls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const result = await readImageAsDataUrl(file, maxSizeMb);
    if (result.success) {
      dataUrls.push(result.dataUrl);
    } else {
      errors.push(result.error);
    }
  }

  return { dataUrls, errors };
}
