import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useId } from 'react';

type ImageDropZoneProps = {
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  multiple: boolean;
  disabled: boolean;
  hint: string;
  isDragging: boolean;
  canAddMore: boolean;
  onDragStateChange: (isDragging: boolean) => void;
  onFilesSelected: (files: FileList | null) => void;
};

const ImageDropZone = ({
  inputRef,
  accept,
  multiple,
  disabled,
  hint,
  isDragging,
  canAddMore,
  onDragStateChange,
  onFilesSelected,
}: ImageDropZoneProps) => {
  const inputId = useId();

  if (!canAddMore) {
    return null;
  }

  const openPicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const dropLabel = multiple
    ? 'Cliquez ou glissez des images'
    : 'Cliquez ou glissez une image';

  return (
    <div
      className={[
        'relative flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition duration-200',
        isDragging
          ? 'border-brand bg-brand/5'
          : 'border-line bg-mist/60 hover:border-brand/40 hover:bg-brand/5',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      ].join(' ')}
      onDragEnter={(e) => {
        e.preventDefault();
        if (!disabled) {
          onDragStateChange(true);
        }
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        onDragStateChange(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDragStateChange(false);
        if (!disabled) {
          onFilesSelected(e.dataTransfer.files);
        }
      }}
      onClick={openPicker}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openPicker();
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={dropLabel}
    >
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => onFilesSelected(e.target.files)}
      />

      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-brand">
        <FontAwesomeIcon icon="image" className="h-5 w-5" />
      </div>
      <p className="text-sm font-semibold text-ink">{dropLabel}</p>
      <p className="mt-1 text-xs text-ink/50">{hint}</p>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-surface px-3 py-1 text-xs font-medium text-brand">
        <FontAwesomeIcon icon="camera" className="h-3 w-3" />
        Parcourir
      </p>
    </div>
  );
};

export default ImageDropZone;
