import { type FormEvent, useState } from 'react';
import { Button } from '../../../../shared/ui';
import type { CartItem, UpdateCartItemPayload } from '../../core/types/cart.types';

type CartReservationEditorProps = {
  item: CartItem;
  updating: boolean;
  onUpdate: (
    itemId: number,
    payload: UpdateCartItemPayload,
  ) => Promise<{ success: boolean; error?: string }>;
};

const CartReservationEditor = ({ item, updating, onUpdate }: CartReservationEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState(item.startDate ?? '');
  const [endDate, setEndDate] = useState(item.endDate ?? '');
  const [guestCount, setGuestCount] = useState(item.guestCount ?? 1);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!startDate || !endDate) {
      setError('Veuillez renseigner les dates de séjour.');
      return;
    }

    if (endDate <= startDate) {
      setError('La date de départ doit être postérieure à la date d’arrivée.');
      return;
    }

    const result = await onUpdate(item.id, { startDate, endDate, guestCount });

    if (!result.success) {
      setError(result.error ?? 'Impossible de modifier le séjour.');
      return;
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setStartDate(item.startDate ?? '');
    setEndDate(item.endDate ?? '');
    setGuestCount(item.guestCount ?? 1);
    setError(null);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Modifier
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Arrivée</span>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            required
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Départ</span>
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            required
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Voyageurs</span>
        <input
          type="number"
          min={1}
          value={guestCount}
          onChange={(event) =>
            setGuestCount(Number.parseInt(event.target.value, 10) || 1)
          }
          className="w-full rounded-sm border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-1 focus:ring-brand"
          required
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={updating}>
          {updating ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
        <Button type="button" variant="secondary" onClick={handleCancel} disabled={updating}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default CartReservationEditor;
