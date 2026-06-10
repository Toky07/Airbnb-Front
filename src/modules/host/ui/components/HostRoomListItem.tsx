import { faBed, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  formatPricePerNight,
  getRoomPrimaryImage,
  getRoomStatusLabel,
  type RoomListItem,
} from '../../../rooms/core/types/room.types';

type HostRoomListItemProps = {
  room: RoomListItem;
  onEdit: (room: RoomListItem) => void;
  onDelete: (room: RoomListItem) => void;
};

const statusClasses: Record<string, string> = {
  available: 'bg-emerald-50 text-emerald-700',
  occupied: 'bg-amber-50 text-amber-700',
  maintenance: 'bg-red-50 text-red-700',
};

const HostRoomListItem = ({ room, onEdit, onDelete }: HostRoomListItemProps) => {
  const image = getRoomPrimaryImage(room);

  return (
    <article className="group relative flex flex-col gap-6 rounded-2xl bg-white p-4 transition-all hover:bg-slate-50 sm:flex-row sm:items-center">
      <div className="h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-32 sm:w-48">
        {image ? (
          <img
            src={image}
            alt={room.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-300">
            <FontAwesomeIcon icon={faBed} className="h-8 w-8" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-slate-900">{room.name}</h3>
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${statusClasses[room.status] ?? statusClasses.available}`}
          >
            {getRoomStatusLabel(room.status)}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>{room.maxGuests} voyageurs</span>
          <span className="text-slate-300">•</span>
          <span>
            {room.bedrooms} chambre{room.bedrooms > 1 ? 's' : ''}
          </span>
          <span className="text-slate-300">•</span>
          <span>
            {room.beds} lit{room.beds > 1 ? 's' : ''}
          </span>
          <span className="text-slate-300">•</span>
          <span>{room.bathrooms} sdb</span>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-brand">{formatPricePerNight(room.pricePerNight)}</span>
            <span className="text-sm text-slate-500">/ nuit</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(room)}
              className="flex h-10 items-center justify-center gap-2 rounded-full bg-slate-100 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 hover:text-slate-900"
            >
              <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
              <span>Modifier</span>
            </button>
            <button
              type="button"
              onClick={() => void onDelete(room)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              title="Supprimer"
            >
              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HostRoomListItem;
