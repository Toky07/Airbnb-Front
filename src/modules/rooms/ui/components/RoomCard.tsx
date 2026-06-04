import { faBed, faLocationDot, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={room.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Aucune photo
          </div>
        )}
        {room.roomType ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
            {room.roomType.name}
          </span>
        ) : null}
        {!bookable ? (
          <span className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-white">
            {getRoomStatusLabel(room.status)}
          </span>
        ) : null}
      </div>

      <div className="space-y-2 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{room.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <FontAwesomeIcon icon={faLocationDot} className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{getRoomLocation(room)}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faUsers} className="h-3 w-3" />
            {room.maxGuests} voyageurs
          </span>
          <span className="inline-flex items-center gap-1">
            <FontAwesomeIcon icon={faBed} className="h-3 w-3" />
            {room.bedrooms} ch.
          </span>
        </div>

        <p className="pt-1 text-base font-semibold text-slate-900">
          {formatPricePerNight(room.pricePerNight)}
          <span className="text-sm font-normal text-slate-500"> / nuit</span>
        </p>
      </div>
    </Link>
  );
};

export default RoomCard;
