import { useCallback, useEffect, useRef, useState } from 'react';
import { readImagesAsDataUrls } from '../../utils/read-image-as-data-url';
import {
  areImageSourcesEqual,
  buildPreviewItems,
  canAddFiles,
  createPreviewId,
  normalizeMultipleValue,
  normalizeSingleValue,
  resolveMaxFiles,
  revokePreviewItems,
} from './image-file-input.utils';
import type { ImagePreviewItem } from './types';

type UseImageFileInputOptions = {
  multiple: boolean;
  value?: string | string[];
  maxFiles?: number;
  maxSizeMb: number;
  onSingleChange: (value: string) => void;
  onMultipleChange: (value: string[]) => void;
  onFileSelect?: (file: File | null) => void;
  onFilesSelect?: (files: File[]) => void;
};

function emitSelectedFiles(
  items: ImagePreviewItem[],
  onFilesSelect?: (files: File[]) => void,
): void {
  if (!onFilesSelect) {
    return;
  }
  onFilesSelect(
    items
      .map((item) => item.file)
      .filter((file): file is File => file instanceof File),
  );
}

type UseImageFileInputResult = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  items: ImagePreviewItem[];
  isDragging: boolean;
  isReading: boolean;
  error: string | null;
  canAddMore: boolean;
  setIsDragging: (value: boolean) => void;
  handleFilesSelected: (files: FileList | null) => void;
  removeItem: (id: string) => void;
};

function emitChange(
  sources: string[],
  multiple: boolean,
  onSingleChange: (value: string) => void,
  onMultipleChange: (value: string[]) => void,
): void {
  if (multiple) {
    onMultipleChange(sources);
    return;
  }
  onSingleChange(sources[0] ?? '');
}

function createBlobPreviewItems(
  files: File[],
  dataUrls: string[],
): ImagePreviewItem[] {
  return dataUrls.map((dataUrl, index) => {
    const file = files[index];
    const previewUrl = file ? URL.createObjectURL(file) : dataUrl;
    return {
      id: createPreviewId(),
      source: dataUrl,
      previewUrl,
      revokeOnUnmount: Boolean(file),
      file,
    };
  });
}

export function useImageFileInput({
  multiple,
  value,
  maxFiles,
  maxSizeMb,
  onSingleChange,
  onMultipleChange,
  onFileSelect,
  onFilesSelect,
}: UseImageFileInputOptions): UseImageFileInputResult {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<ImagePreviewItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const blobItemsRef = useRef<ImagePreviewItem[]>([]);
  const syncedValueSourcesRef = useRef<string[]>([]);

  const resolvedMaxFiles = resolveMaxFiles(multiple, maxFiles);
  const canAddMore = items.length < resolvedMaxFiles;

  const syncFromValue = useCallback(() => {
    const sources = multiple
      ? normalizeMultipleValue(value as string[] | undefined)
      : normalizeSingleValue(value as string | undefined);

    if (areImageSourcesEqual(syncedValueSourcesRef.current, sources)) {
      return;
    }

    syncedValueSourcesRef.current = sources;
    revokePreviewItems(blobItemsRef.current);
    blobItemsRef.current = [];
    setItems(buildPreviewItems(sources));
  }, [multiple, value]);

  useEffect(() => {
    syncFromValue();
  }, [syncFromValue]);

  useEffect(() => {
    return () => {
      revokePreviewItems(blobItemsRef.current);
    };
  }, []);

  const updateItemsAndEmit = useCallback(
    (nextItems: ImagePreviewItem[]) => {
      setItems(nextItems);
      emitChange(
        nextItems.map((item) => item.source),
        multiple,
        onSingleChange,
        onMultipleChange,
      );
      if (multiple) {
        emitSelectedFiles(nextItems, onFilesSelect);
      }
    },
    [multiple, onFilesSelect, onMultipleChange, onSingleChange],
  );

  const removeItem = useCallback(
    (id: string) => {
      const removed = items.find((item) => item.id === id);
      if (removed?.revokeOnUnmount) {
        URL.revokeObjectURL(removed.previewUrl);
        blobItemsRef.current = blobItemsRef.current.filter((item) => item.id !== id);
      }
      updateItemsAndEmit(items.filter((item) => item.id !== id));
      onFileSelect?.(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [items, onFileSelect, updateItemsAndEmit],
  );

  const handleFilesSelected = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) {
        return;
      }

      const fileArray = Array.from(files);
      const slotsLeft = resolvedMaxFiles - items.length;
      const filesToProcess = multiple
        ? fileArray.slice(0, slotsLeft)
        : fileArray.slice(0, 1);

      if (!canAddFiles(items.length, filesToProcess.length, resolvedMaxFiles)) {
        setError(
          multiple
            ? `Maximum ${resolvedMaxFiles} images autorisées.`
            : 'Une seule image est autorisée.',
        );
        return;
      }

      setError(null);
      setIsReading(true);

      if (!multiple) {
        revokePreviewItems([...items, ...blobItemsRef.current]);
        blobItemsRef.current = [];
      }

      const { dataUrls, errors } = await readImagesAsDataUrls(
        filesToProcess,
        maxSizeMb,
      );

      const newItems = createBlobPreviewItems(filesToProcess, dataUrls);
      blobItemsRef.current = [...blobItemsRef.current, ...newItems];

      if (!multiple && filesToProcess[0]) {
        onFileSelect?.(filesToProcess[0]);
      }

      setIsReading(false);

      if (errors.length > 0) {
        setError(errors[0] ?? 'Erreur lors du chargement.');
      }

      if (newItems.length === 0) {
        return;
      }

      const nextItems = multiple ? [...items, ...newItems] : newItems;
      updateItemsAndEmit(nextItems);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [items, maxSizeMb, multiple, resolvedMaxFiles, updateItemsAndEmit, onFileSelect],
  );

  return {
    inputRef,
    items,
    isDragging,
    isReading,
    error,
    canAddMore,
    setIsDragging,
    handleFilesSelected,
    removeItem,
  };
}
