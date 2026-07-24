import { Link } from 'react-router';
import { Button } from '../../../../shared/ui';
import PricingBreakdownSummary from '../../../../shared/ui/pricing/PricingBreakdownSummary';
import DatePickerCalendar from '../../../../shared/ui/calendar/DatePickerCalendar';
import { formatPricePerNight } from '../../../rooms/core/types/room.types';
import type { RoomListItem } from '../../../rooms/core/types/room.types';
import { useAddToCart } from '../../../cart/ui/hooks/useAddToCart';
import { getCancellationPolicyLabel } from '../../core/constants/cancellation-policy.constants';
import { useDateRangeAvailability } from '../hooks/useDateRangeAvailability';

type RoomBookingPanelProps = {
  room: RoomListItem;
  returnPath: string;
};

const RoomBookingPanel = ({ room }: RoomBookingPanelProps) => {
  const {
    form,
    preview,
    pricingBreakdown,
    pricingLoading,
    loading,
    error,
    added,
    updateField,
    submit,
    goToCart,
    resetAdded,
  } = useAddToCart({
    roomId: room.id,
    roomSlug: room.slug,
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
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 soft-shadow">
        <h2 className="font-display text-2xl font-bold text-emerald-900">Ajouté au panier</h2>
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
    <div className="surface rounded-2xl p-8 soft-shadow">
      <p className="font-display text-3xl font-bold text-ink">
        {formatPricePerNight(room.pricePerNight)}
        <span className="text-lg font-normal text-ink/50"> / nuit</span>
      </p>
      {getCancellationPolicyLabel(room.property?.cancellationPolicy) ? (
        <p className="mt-3 inline-flex rounded-xl bg-mist px-3 py-1 text-sm font-medium text-ink/70">
          {getCancellationPolicyLabel(room.property?.cancellationPolicy)}
        </p>
      ) : null}

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div>
          <span className="mb-3 block text-sm font-medium text-ink/70">
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
          <div className="flex items-center gap-3 rounded-xl border border-line bg-mist/60 px-4 py-3 text-sm text-ink/60">
            <span>Du <strong className="text-ink">{formatDisplayDate(form.startDate)}</strong></span>
            <span className="text-ink/30">→</span>
            <span>Au <strong className="text-ink">{formatDisplayDate(form.endDate)}</strong></span>
          </div>
        ) : null}

        {form.startDate && form.endDate && !rangeAvailable ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Cette chambre n'est pas disponible pour les dates sélectionnées.
          </p>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-ink/70">Voyageurs</span>
          <input
            type="number"
            min={1}
            max={room.maxGuests}
            value={form.guestCount}
            onChange={(event) =>
              updateField('guestCount', Number.parseInt(event.target.value, 10) || 1)
            }
            className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm outline-none transition duration-200 focus:border-brand focus:ring-2 focus:ring-brand/20"
            required
          />
        </label>

        {preview && rangeAvailable ? (
          <div className="space-y-3 rounded-xl border border-line bg-mist/60 px-5 py-4 text-ink/70">
            <p className="text-sm text-ink/60">
              {preview.nights} nuit{preview.nights > 1 ? 's' : ''}
            </p>
            {pricingLoading ? (
              <p className="text-sm text-ink/50">Calcul des taxes et frais…</p>
            ) : pricingBreakdown ? (
              <PricingBreakdownSummary
                breakdown={pricingBreakdown}
                totalClassName="text-lg font-medium text-ink"
              />
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm">Total estimé</span>
                <span className="text-lg font-medium text-ink">
                  {formatPricePerNight(preview.totalPrice)}
                </span>
              </div>
            )}
          </div>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="mt-2 w-full" disabled={!canSubmit}>
          {loading ? 'Ajout…' : 'Ajouter au panier'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/50">
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
