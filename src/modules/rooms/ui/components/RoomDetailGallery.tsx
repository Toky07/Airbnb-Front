import { useState } from 'react';
import { resolveRoomImageUrls, type RoomListItem } from '../../core/types/room.types';

type RoomDetailGalleryProps = {
  room: RoomListItem;
};

const RoomDetailGallery = ({ room }: RoomDetailGalleryProps) => {
  const images = resolveRoomImageUrls(room.images);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? null;

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
        Aucune photo disponible
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl bg-slate-100">
        <img
          src={activeImage ?? undefined}
          alt={room.name}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={[
                'overflow-hidden rounded-xl border-2 transition',
                index === activeIndex ? 'border-brand' : 'border-transparent opacity-80 hover:opacity-100',
              ].join(' ')}
            >
              <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default RoomDetailGallery;
