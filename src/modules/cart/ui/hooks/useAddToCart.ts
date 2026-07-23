import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../../../cart/ui/hooks/useCart';
import { getGetRoomPricingPreviewUseCase } from '../../../rooms/application/composition/room.composition';
import type { BookingFormValues } from '../../../reservation/core/types/reservation.types';
import {
  calculateStayAmountPreview,
  getFirstAvailableDates,
} from '../../../reservation/core/utils/calculate-stay-amount';
import { isBookingRangeAvailable } from '../../../reservation/core/utils/date-range-availability';
import type { PricingBreakdown } from '../../../../shared/pricing/pricing-breakdown.types';
import type { UnavailableDateRange } from '../../../rooms/core/types/room.types';

const EMPTY_UNAVAILABLE_DATES: UnavailableDateRange[] = [];

type UseAddToCartOptions = {
  roomId: number;
  roomSlug: string;
  pricePerNight: number;
  maxGuests: number;
  unavailableDates?: UnavailableDateRange[];
};

export function useAddToCart({
  roomId,
  roomSlug,
  pricePerNight,
  maxGuests,
  unavailableDates = EMPTY_UNAVAILABLE_DATES,
}: UseAddToCartOptions) {
  const navigate = useNavigate();
  const { addReservation } = useCart();
  const getRoomPricingPreviewUseCase = useMemo(
    () => getGetRoomPricingPreviewUseCase(),
    [],
  );
  const unavailableKey = JSON.stringify(unavailableDates);
  const [form, setForm] = useState<BookingFormValues>(() => ({
    ...getFirstAvailableDates(unavailableDates),
    guestCount: 1,
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [pricingBreakdown, setPricingBreakdown] = useState<PricingBreakdown | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  useEffect(() => {
    setForm((current) => {
      if (
        isBookingRangeAvailable(current.startDate, current.endDate, unavailableDates)
      ) {
        return current;
      }

      return {
        ...getFirstAvailableDates(unavailableDates),
        guestCount: current.guestCount,
      };
    });
    setAdded(false);
    setError(null);
    // unavailableKey serializes unavailableDates to avoid effect churn on new array references.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- unavailableKey tracks unavailableDates content
  }, [roomId, unavailableKey]);

  const localPreview = useMemo(
    () => calculateStayAmountPreview(form.startDate, form.endDate, pricePerNight),
    [form.endDate, form.startDate, pricePerNight],
  );

  useEffect(() => {
    if (!form.startDate || !form.endDate || !localPreview) {
      setPricingBreakdown(null);
      return;
    }

    if (!isBookingRangeAvailable(form.startDate, form.endDate, unavailableDates)) {
      setPricingBreakdown(null);
      return;
    }

    let cancelled = false;
    setPricingLoading(true);

    void getRoomPricingPreviewUseCase
      .execute(roomSlug, {
        startDate: form.startDate,
        endDate: form.endDate,
        guestCount: form.guestCount,
      })
      .then((breakdown) => {
        if (!cancelled) {
          setPricingBreakdown(breakdown);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setPricingLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    form.endDate,
    form.guestCount,
    form.startDate,
    getRoomPricingPreviewUseCase,
    localPreview,
    roomSlug,
    unavailableDates,
  ]);

  const preview = localPreview;

  const updateField = <K extends keyof BookingFormValues>(
    key: K,
    value: BookingFormValues[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError(null);
    setAdded(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setAdded(false);

    if (form.guestCount > maxGuests) {
      setError(`Cette chambre accepte au maximum ${maxGuests} voyageurs.`);
      return;
    }

    if (!preview) {
      setError('Veuillez sélectionner des dates de séjour valides.');
      return;
    }

    if (!isBookingRangeAvailable(form.startDate, form.endDate, unavailableDates)) {
      setError('Cette chambre n’est pas disponible pour les dates sélectionnées.');
      return;
    }

    setLoading(true);
    const result = await addReservation({
      roomId,
      startDate: form.startDate,
      endDate: form.endDate,
      guestCount: form.guestCount,
    });
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? 'Impossible d’ajouter au panier.');
      return;
    }

    setAdded(true);
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const resetAdded = () => {
    setAdded(false);
    setError(null);
  };

  return {
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
  };
}
