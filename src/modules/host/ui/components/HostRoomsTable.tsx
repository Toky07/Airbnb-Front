import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  formatPricePerNight,
  getRoomPrimaryImage,
  getRoomStatusLabel,
  type RoomListItem,
} from '../../../rooms/core/types/room.types';
import HostDataTable, {
  HostDataTableBody,
  HostDataTableCell,
  HostDataTableHead,
  HostDataTableHeaderCell,
  HostDataTableRow,
} from './HostDataTable';

type HostRoomsTableProps = {
  rooms: RoomListItem[];
  onEdit: (room: RoomListItem) => void;
  onDelete: (room: RoomListItem) => void;
};

const statusClasses: Record<string, string> = {
  available: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/15',
  occupied: 'bg-amber-500/10 text-amber-700 ring-amber-500/15',
  maintenance: 'bg-red-500/10 text-red-700 ring-red-500/15',
};

const HostRoomsTable = ({ rooms, onEdit, onDelete }: HostRoomsTableProps) => (
  <HostDataTable>
    <table className="min-w-full">
      <HostDataTableHead>
        <HostDataTableHeaderCell>Chambre</HostDataTableHeaderCell>
        <HostDataTableHeaderCell>Capacité</HostDataTableHeaderCell>
        <HostDataTableHeaderCell>Type</HostDataTableHeaderCell>
        <HostDataTableHeaderCell>Statut</HostDataTableHeaderCell>
        <HostDataTableHeaderCell align="right">Prix / nuit</HostDataTableHeaderCell>
        <HostDataTableHeaderCell align="right">Actions</HostDataTableHeaderCell>
      </HostDataTableHead>
      <HostDataTableBody>
        {rooms.map((room) => {
          const image = getRoomPrimaryImage(room);

          return (
            <HostDataTableRow key={room.id}>
              <HostDataTableCell>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-mist">
                    {image ? (
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink/40">
                        <FontAwesomeIcon icon="bed" className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{room.name}</p>
                    <p className="mt-0.5 text-xs text-ink/50">{room.size} m²</p>
                  </div>
                </div>
              </HostDataTableCell>
              <HostDataTableCell>
                <span className="text-ink/70">
                  {room.maxGuests} pers. · {room.bedrooms} ch. · {room.beds} lit
                  {room.beds > 1 ? 's' : ''}
                </span>
              </HostDataTableCell>
              <HostDataTableCell>
                <span className="text-ink/70">{room.roomType?.name ?? '—'}</span>
              </HostDataTableCell>
              <HostDataTableCell>
                <span
                  className={[
                    'inline-flex rounded-xl px-3 py-1 text-xs font-semibold ring-1 ring-inset',
                    statusClasses[room.status] ?? statusClasses.available,
                  ].join(' ')}
                >
                  {getRoomStatusLabel(room.status)}
                </span>
              </HostDataTableCell>
              <HostDataTableCell align="right">
                <span className="font-semibold text-ink">
                  {formatPricePerNight(room.pricePerNight)}
                </span>
              </HostDataTableCell>
              <HostDataTableCell align="right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(room)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink/50 transition hover:bg-mist hover:text-ink"
                    aria-label={`Modifier ${room.name}`}
                  >
                    <FontAwesomeIcon icon="pen" className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void onDelete(room)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink/50 transition hover:bg-red-500/10 hover:text-red-600"
                    aria-label={`Supprimer ${room.name}`}
                  >
                    <FontAwesomeIcon icon="trash" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </HostDataTableCell>
            </HostDataTableRow>
          );
        })}
      </HostDataTableBody>
    </table>
  </HostDataTable>
);

export default HostRoomsTable;
