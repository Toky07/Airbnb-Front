import { Link } from 'react-router';
import { Button } from '../../../../shared/ui';
import DatePickerCalendar from '../../../../shared/ui/calendar/DatePickerCalendar';
import { formatPricePerNight } from '../../../rooms/core/types/room.types';
import type { RoomListItem } from '../../../rooms/core/types/room.types';
import { useAddToCart } from '../../../cart/ui/hooks/useAddToCart';
import { useDateRangeAvailability } from '../hooks/useDateRangeAvailability';

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
    unavailableDates: room.unavailableDates,
  });

  const { isDateDisabled, rangeAvailable } = useDateRangeAvailability(
    room.unavailableDates ?? [],
    form.startDate,
    form.endDate,
  );

  const canSubmit =
    !!form.startDate &&
    !!form.endDate &&
    !!preview &&
    rangeAvailable &&
    !loading;

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
        <div>
          <span className="mb-3 block text-sm font-medium text-slate-700">
            Sélectionnez vos dates
          </span>
          <DatePickerCalendar
              selectedStart={form.startDate}
              selectedEnd={form.endDate}
              onSelectStart={(date) => updateField('startDate', date)}
              onSelectEnd={(date) => updateField('endDate', date)}
              isDateDisabled={isDateDisabled}
            />
        </div>

        {form.startDate && form.endDate ? (
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600 border border-slate-100">
            <span>Du <strong className="text-slate-900">{formatDisplayDate(form.startDate)}</strong></span>
            <span className="text-slate-300">→</span>
            <span>Au <strong className="text-slate-900">{formatDisplayDate(form.endDate)}</strong></span>
          </div>
        ) : null}

        {form.startDate && form.endDate && !rangeAvailable ? (
          <p className="rounded-sm border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Cette chambre n'est pas disponible pour les dates sélectionnées.
          </p>
        ) : null}

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
            className="w-full rounded-sm border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-1 focus:ring-brand"
            required
          />
        </label>

        {preview && rangeAvailable ? (
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

        <Button type="submit" className="w-full mt-2" disabled={!canSubmit}>
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

function formatDisplayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(y, m - 1, d));
}

export default RoomBookingPanel;
