import { Link } from 'react-router';
import { Button } from '../../../../shared/ui';
import { formatPricePerNight } from '../../../rooms/core/types/room.types';
import type { RoomListItem } from '../../../rooms/core/types/room.types';
import { useAddToCart } from '../../../cart/ui/hooks/useAddToCart';

const inputClassName =
  'w-full rounded-sm border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand';

type RoomBookingPanelProps = {
  room: RoomListItem;
  returnPath: string;
};

const RoomBookingPanel = ({ room }: RoomBookingPanelProps) => {
  const {
    form,
    preview,
    loading,
    error,
    added,
    updateField,
    submit,
    goToCart,
    resetAdded,
  } = useAddToCart({
    roomId: room.id,
    pricePerNight: room.pricePerNight,
    maxGuests: room.maxGuests,
  });

  if (added) {
    return (
      <div className="rounded-sm border border-emerald-200 bg-emerald-50 p-8 shadow-xl shadow-emerald-100/40">
        <h2 className="font-serif text-2xl font-medium text-emerald-900">Ajouté au panier</h2>
        <p className="mt-3 text-emerald-800">
          Votre séjour a été ajouté. Vous pouvez continuer vos recherches ou procéder au paiement.
        </p>
        <div className="mt-8 flex flex-col gap-4">
          <Button type="button" className="w-full" onClick={goToCart}>
            Voir le panier
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={resetAdded}>
            Ajouter un autre séjour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
      <p className="text-3xl font-medium text-slate-900">
        {formatPricePerNight(room.pricePerNight)}
        <span className="text-lg font-normal text-slate-500"> / nuit</span>
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Arrivée</span>
          <input
            type="date"
            value={form.startDate}
            onChange={(event) => updateField('startDate', event.target.value)}
            className={inputClassName}
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Départ</span>
          <input
            type="date"
            value={form.endDate}
            min={form.startDate || undefined}
            onChange={(event) => updateField('endDate', event.target.value)}
            className={inputClassName}
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Voyageurs</span>
          <input
            type="number"
            min={1}
            max={room.maxGuests}
            value={form.guestCount}
            onChange={(event) =>
              updateField('guestCount', Number.parseInt(event.target.value, 10) || 1)
            }
            className={inputClassName}
            required
          />
        </label>

        {preview ? (
          <div className="rounded-sm bg-slate-50 px-5 py-4 text-slate-700 border border-slate-100">
            <div className="flex items-center justify-between">
              <span>
                {preview.nights} nuit{preview.nights > 1 ? 's' : ''}
              </span>
              <span className="text-lg font-medium text-slate-900">
                {formatPricePerNight(preview.totalPrice)}
              </span>
            </div>
          </div>
        ) : null}

        {error ? (
          <p className="rounded-sm border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? 'Ajout…' : 'Ajouter au panier'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Pas besoin de compte pour ajouter au panier.<br/>
        <Link to="/cart" className="mt-1 inline-block font-medium tracking-wide text-brand hover:text-brand-dark">
          Voir le panier
        </Link>
      </p>
    </div>
  );
};

export default RoomBookingPanel;
