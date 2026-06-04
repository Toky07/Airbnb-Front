import {
  faBath,
  faBed,
  faClock,
  faDoorOpen,
  faRulerCombined,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { RoomListItem } from '../../core/types/room.types';

type RoomAmenitiesProps = {
  room: RoomListItem;
};

const items = (room: RoomListItem) => [
  { icon: faUsers, label: `${room.maxGuests} voyageurs max.` },
  { icon: faBed, label: `${room.bedrooms} chambre${room.bedrooms > 1 ? 's' : ''}` },
  { icon: faBath, label: `${room.bathrooms} salle${room.bathrooms > 1 ? 's' : ''} de bain` },
  { icon: faDoorOpen, label: `${room.beds} lit${room.beds > 1 ? 's' : ''}` },
  { icon: faRulerCombined, label: `${room.size} m²` },
];

const RoomAmenities = ({ room }: RoomAmenitiesProps) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-slate-900">Ce logement</h2>
    <ul className="grid gap-3 sm:grid-cols-2">
      {items(room).map((item) => (
        <li key={item.label} className="flex items-center gap-3 text-sm text-slate-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
          </span>
          {item.label}
        </li>
      ))}
    </ul>

    {room.property?.checkInTime || room.property?.checkOutTime ? (
      <div className="rounded-2xl border border-slate-200 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">Horaires</h3>
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {room.property.checkInTime ? (
            <span className="inline-flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" />
              Arrivée : {room.property.checkInTime}
            </span>
          ) : null}
          {room.property.checkOutTime ? (
            <span className="inline-flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="h-3.5 w-3.5" />
              Départ : {room.property.checkOutTime}
            </span>
          ) : null}
        </div>
      </div>
    ) : null}
  </div>
);

export default RoomAmenities;
