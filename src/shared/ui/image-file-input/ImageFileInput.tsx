import { buildHint, DEFAULT_IMAGE_ACCEPT } from './image-file-input.utils';
import ImageDropZone from './ImageDropZone';
import ImagePreviewList from './ImagePreviewList';
import type { ImageFileInputProps } from './types';
import { useImageFileInput } from './useImageFileInput';

const ImageFileInput = (props: ImageFileInputProps) => {
  const {
    label = 'Photo',
    hint,
    optional = true,
    accept = DEFAULT_IMAGE_ACCEPT,
    maxSizeMb = 5,
    maxFiles,
    disabled = false,
    fallbackInitials = '?',
  } = props;

  const multiple = props.multiple === true;

  const {
    inputRef,
    items,
    isDragging,
    isReading,
    error,
    canAddMore,
    setIsDragging,
    handleFilesSelected,
    removeItem,
  } = useImageFileInput({
    multiple,
    value: props.value,
    maxFiles,
    maxSizeMb,
    onSingleChange: multiple ? () => {} : props.onChange,
    onMultipleChange: multiple ? props.onChange : () => {},
    onFileSelect: props.onFileSelect,
    onFilesSelect: props.onFilesSelect,
  });

  const resolvedMaxFiles = multiple ? (maxFiles ?? 10) : 1;
  const resolvedHint =
    hint ?? buildHint(maxSizeMb, resolvedMaxFiles, multiple);

  const showDropZone = canAddMore && !isReading;
  const layoutRow = !multiple || items.length <= 1;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-ink/80">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-ink/40">(optionnel)</span>
        )}
      </label>

      <div
        className={[
          layoutRow
            ? 'flex flex-col gap-4 sm:flex-row sm:items-start'
            : 'flex flex-col gap-4',
        ].join(' ')}
      >
        <ImagePreviewList
          items={items}
          multiple={multiple}
          fallbackInitials={fallbackInitials}
          disabled={disabled}
          isLoading={isReading && !multiple}
          onRemove={removeItem}
        />

        {showDropZone && (
          <ImageDropZone
            inputRef={inputRef}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            hint={resolvedHint}
            isDragging={isDragging}
            canAddMore={canAddMore}
            onDragStateChange={setIsDragging}
            onFilesSelected={(files) => void handleFilesSelected(files)}
          />
        )}
      </div>

      {isReading && multiple && (
        <p className="text-sm text-ink/60">Chargement des images...</p>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageFileInput;
