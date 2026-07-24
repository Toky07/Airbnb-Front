import { resolveMediaUrl } from '../utils/resolve-media-url';
import ImagePreviewTile from './image-file-input/ImagePreviewTile';

type ImageGalleryProps = {
  images: string[];
  alt: string;
  onRemove?: (imagePath: string, index: number) => void;
};

const ImageGallery = ({ images, alt, onRemove }: ImageGalleryProps) => {
  const urls = images
    .map((path) => resolveMediaUrl(path))
    .filter((url): url is string => url !== null);

  if (urls.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-2xl border border-dashed border-line bg-mist text-sm text-ink/50">
        Aucune photo
      </div>
    );
  }

  if (onRemove) {
    return (
      <div className="flex flex-wrap gap-4">
        {images.map((path, index) => {
          const url = resolveMediaUrl(path);
          if (!url) {
            return null;
          }
          return (
            <ImagePreviewTile
              key={`${path}-${index}`}
              previewUrl={url}
              alt={`${alt} ${index + 1}`}
              size="md"
              onRemove={() => onRemove(path, index)}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={
        urls.length === 1
          ? 'grid grid-cols-1'
          : 'grid grid-cols-2 gap-3 sm:grid-cols-3'
      }
    >
      {urls.map((url, index) => (
        <img
          key={`${url}-${index}`}
          src={url}
          alt={`${alt} ${index + 1}`}
          className="aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-line"
        />
      ))}
    </div>
  );
};

export default ImageGallery;
