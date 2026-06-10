import Avatar from '../Avatar';
import type { ImagePreviewItem } from './types';
import ImagePreviewTile from './ImagePreviewTile';

type ImagePreviewListProps = {
  items: ImagePreviewItem[];
  multiple: boolean;
  fallbackInitials: string;
  disabled: boolean;
  isLoading: boolean;
  onRemove: (id: string) => void;
};

const ImagePreviewList = ({
  items,
  multiple,
  fallbackInitials,
  disabled,
  isLoading,
  onRemove,
}: ImagePreviewListProps) => {
  if (items.length === 0 && !multiple) {
    return (
      <Avatar initials={fallbackInitials} alt="Aperçu" size="xl" />
    );
  }

  if (items.length === 0) {
    return null;
  }

  if (!multiple && items.length === 1) {
    const item = items[0];
    return (
      <ImagePreviewTile
        previewUrl={item.previewUrl}
        alt="Aperçu"
        size="lg"
        isLoading={isLoading}
        onRemove={disabled ? undefined : () => onRemove(item.id)}
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => (
        <ImagePreviewTile
          key={item.id}
          previewUrl={item.previewUrl}
          alt="Aperçu"
          size="md"
          onRemove={disabled ? undefined : () => onRemove(item.id)}
        />
      ))}
    </div>
  );
};

export default ImagePreviewList;
