import ImagePreviewRemoveButton from './ImagePreviewRemoveButton';

type ImagePreviewTileProps = {
  previewUrl: string;
  alt: string;
  onRemove?: () => void;
  removeLabel?: string;
  size?: 'md' | 'lg';
  isLoading?: boolean;
};

const sizeClasses = {
  md: 'h-20 w-20 rounded-xl',
  lg: 'h-24 w-24 rounded-2xl',
};

const ImagePreviewTile = ({
  previewUrl,
  alt,
  onRemove,
  removeLabel = 'Retirer l’image',
  size = 'lg',
  isLoading = false,
}: ImagePreviewTileProps) => (
  <div className="relative shrink-0">
    <img
      src={previewUrl}
      alt={alt}
      className={`${sizeClasses[size]} object-cover ring-4 ring-white shadow-lg`}
    />
    {onRemove && (
      <ImagePreviewRemoveButton onClick={onRemove} label={removeLabel} />
    )}
    {isLoading && (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-white/70 ${sizeClasses[size]}`}
      >
        <span className="text-xs font-medium text-slate-600">Chargement...</span>
      </div>
    )}
  </div>
);

export default ImagePreviewTile;
