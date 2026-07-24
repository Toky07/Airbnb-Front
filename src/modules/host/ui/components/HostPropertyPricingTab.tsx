import { type FormEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { EmptyState, InlineErrorPanel, PageSkeleton } from '../../../../shared/ui';
import { formatPricePerNight, type RoomListItem } from '../../../rooms/core/types/room.types';
import { useHostRoomRateOverrides } from '../hooks/useHostRoomRateOverrides';

type HostPropertyPricingTabProps = {
  propertyId: number;
  rooms: RoomListItem[];
  roomsLoading: boolean;
};

const HostPropertyPricingTab = ({
  propertyId,
  rooms,
  roomsLoading,
}: HostPropertyPricingTabProps) => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(
    rooms[0]?.id ?? null,
  );
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [label, setLabel] = useState('');

  const activeRoomId =
    selectedRoomId && rooms.some((room) => room.id === selectedRoomId)
      ? selectedRoomId
      : (rooms[0]?.id ?? null);

  const rateOverrides = useHostRoomRateOverrides(propertyId, activeRoomId);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const price = Number(pricePerNight);
    if (!startDate || !endDate || endDate <= startDate || !Number.isFinite(price) || price <= 0) {
      rateOverrides.setError(
        'Indiquez une plage valide et un prix par nuit supérieur à 0.',
      );
      return;
    }

    const ok = await rateOverrides.create(
      startDate,
      endDate,
      price,
      label.trim() || undefined,
    );
    if (ok) {
      setStartDate('');
      setEndDate('');
      setPricePerNight('');
      setLabel('');
    }
  };

  if (roomsLoading) {
    return <PageSkeleton className="h-64" />;
  }

  if (rooms.length === 0) {
    return (
      <EmptyState
        title="Aucune chambre"
        description="Créez d’abord une chambre pour gérer sa tarification."
      />
    );
  }

  const activeRoom = rooms.find((room) => room.id === activeRoomId);

  return (
    <div className="space-y-8">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Chambre</label>
        <select
          value={activeRoomId ?? ''}
          onChange={(event) => setSelectedRoomId(Number(event.target.value))}
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-400"
        >
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>
        {activeRoom ? (
          <p className="mt-2 text-sm text-slate-500">
            Tarif de base : {formatPricePerNight(activeRoom.pricePerNight)}
            {activeRoom.weekendPricePerNight
              ? ` · Week-end : ${formatPricePerNight(activeRoom.weekendPricePerNight)}`
              : ''}
          </p>
        ) : null}
      </div>

      {rateOverrides.error ? <InlineErrorPanel message={rateOverrides.error} /> : null}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-[1fr_1fr_0.8fr_1fr_auto]"
      >
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-slate-700">Début</span>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-slate-700">Fin (exclusive)</span>
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => setEndDate(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-slate-700">Prix / nuit (€)</span>
          <input
            type="number"
            min={1}
            value={pricePerNight}
            onChange={(event) => setPricePerNight(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="font-medium text-slate-700">Libellé (optionnel)</span>
          <input
            type="text"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Été, événement…"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-slate-400"
          />
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={rateOverrides.saving}
            className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            Ajouter
          </button>
        </div>
      </form>

      {rateOverrides.loading ? <PageSkeleton className="h-40" /> : null}

      {!rateOverrides.loading && rateOverrides.items.length === 0 ? (
        <EmptyState
          title="Aucun tarif spécial"
          description="Ajoutez des tarifs saisonniers ou événementiels. Le tarif week-end se règle dans la fiche chambre."
        />
      ) : null}

      {!rateOverrides.loading && rateOverrides.items.length > 0 ? (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {rateOverrides.items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {item.startDate} → {item.endDate}
                  <span className="ml-2 text-emerald-700">
                    {formatPricePerNight(item.pricePerNight)}
                  </span>
                </p>
                {item.label ? (
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                ) : null}
              </div>
              <button
                type="button"
                disabled={rateOverrides.saving}
                onClick={() => void rateOverrides.remove(item.id)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
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

export default HostPropertyPricingTab;
