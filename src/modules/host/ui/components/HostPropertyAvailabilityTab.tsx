import { type FormEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EmptyState, InlineErrorPanel, PageSkeleton } from '../../../../shared/ui';
import type { RoomListItem } from '../../../rooms/core/types/room.types';
import { hostFieldClassName } from '../constants/host-form-classes';
import { useHostRoomBlockedDates } from '../hooks/useHostRoomBlockedDates';

type HostPropertyAvailabilityTabProps = {
  propertyId: number;
  rooms: RoomListItem[];
  roomsLoading: boolean;
};

const HostPropertyAvailabilityTab = ({
  propertyId,
  rooms,
  roomsLoading,
}: HostPropertyAvailabilityTabProps) => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(
    rooms[0]?.id ?? null,
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const activeRoomId =
    selectedRoomId && rooms.some((room) => room.id === selectedRoomId)
      ? selectedRoomId
      : (rooms[0]?.id ?? null);

  const blockedDates = useHostRoomBlockedDates(propertyId, activeRoomId);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!startDate || !endDate || endDate <= startDate) {
      blockedDates.setError('La date de fin doit être postérieure à la date de début.');
      return;
    }

    const ok = await blockedDates.create(startDate, endDate, reason.trim() || undefined);
    if (ok) {
      setStartDate('');
      setEndDate('');
      setReason('');
    }
  };

  if (roomsLoading) {
    return <PageSkeleton className="h-64" />;
  }

  if (rooms.length === 0) {
    return (
      <EmptyState
        title="Aucune chambre"
        description="Créez d’abord une chambre pour gérer sa disponibilité."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <label className="mb-2 block text-sm font-medium text-ink/70">Chambre</label>
        <select
          value={activeRoomId ?? ''}
          onChange={(event) => setSelectedRoomId(Number(event.target.value))}
          className={`max-w-md ${hostFieldClassName}`}
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
      </div>

      {blockedDates.error ? <InlineErrorPanel message={blockedDates.error} /> : null}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-ink/8 bg-surface p-6 soft-shadow md:grid-cols-[1fr_1fr_1.2fr_auto]"
      >
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-ink/70">Début</span>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
            className={hostFieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-ink/70">Fin</span>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => setEndDate(event.target.value)}
            required
            className={hostFieldClassName}
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-ink/70">Motif (optionnel)</span>
          <input
            type="text"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Maintenance, fermeture…"
            className={hostFieldClassName}
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={blockedDates.saving}
            className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            Bloquer
          </button>
        </div>
      </form>

      {blockedDates.loading ? <PageSkeleton className="h-40" /> : null}

      {!blockedDates.loading && blockedDates.items.length === 0 ? (
        <EmptyState
          title="Aucune période bloquée"
          description="Bloquez des dates pour empêcher les réservations sur cette chambre."
        />
      ) : null}

      {!blockedDates.loading && blockedDates.items.length > 0 ? (
        <ul className="divide-y divide-ink/8 overflow-hidden rounded-2xl border border-ink/8 bg-surface">
          {blockedDates.items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="font-medium text-ink">
                  {item.startDate} → {item.endDate}
                </p>
                {item.reason ? (
                  <p className="mt-1 text-sm text-ink/50">{item.reason}</p>
                ) : null}
              </div>
              <button
                type="button"
                disabled={blockedDates.saving}
                onClick={() => void blockedDates.remove(item.id)}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-500/10 disabled:opacity-60"
              >
                <FontAwesomeIcon icon="trash" className="h-3.5 w-3.5" />
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default HostPropertyAvailabilityTab;
