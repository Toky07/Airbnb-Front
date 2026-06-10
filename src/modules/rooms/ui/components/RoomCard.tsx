import { Link } from 'react-router';
import {
  formatPricePerNight,
  getRoomLocation,
  getRoomPrimaryImage,
  getRoomStatusLabel,
  isRoomBookable,
  type RoomListItem,
} from '../../core/types/room.types';

type RoomCardProps = {
  room: RoomListItem;
};

const RoomCard = ({ room }: RoomCardProps) => {
  const imageUrl = getRoomPrimaryImage(room);
  const bookable = isRoomBookable(room);

  return (
    <Link
      to={`/rooms/${room.id}`}
      className="group block"
    >
      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={room.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Aucune photo
          </div>
        )}
        {!bookable ? (
          <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur-md">
            {getRoomStatusLabel(room.status)}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-col">
        <div className="flex items-start justify-between">
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{getRoomLocation(room)}</h3>
          {room.roomType ? (
            <span className="shrink-0 text-sm text-slate-500">
              {room.roomType.name}
            </span>
          ) : null}
        </div>

        <p className="line-clamp-1 text-sm text-slate-500">{room.name}</p>
        <p className="text-sm text-slate-500">{room.maxGuests} voyageurs · {room.bedrooms} ch.</p>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-base font-semibold text-slate-900">{formatPricePerNight(room.pricePerNight)}</span>
          <span className="text-sm text-slate-900">par nuit</span>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
