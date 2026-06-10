import { type FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../../../cart/ui/hooks/useCart';
import type { BookingFormValues } from '../../../reservation/core/types/reservation.types';
import {
  calculateStayAmountPreview,
  getFirstAvailableDates,
} from '../../../reservation/core/utils/calculate-stay-amount';
import type { UnavailableDateRange } from '../../../rooms/core/types/room.types';

type UseAddToCartOptions = {
  roomId: number;
  pricePerNight: number;
  maxGuests: number;
  unavailableDates?: UnavailableDateRange[];
};

export function useAddToCart({ roomId, pricePerNight, maxGuests, unavailableDates = [] }: UseAddToCartOptions) {
  const navigate = useNavigate();
  const { addReservation } = useCart();
  const [form, setForm] = useState<BookingFormValues>(() => ({
    ...getFirstAvailableDates(unavailableDates),
    guestCount: 1,
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const preview = useMemo(
    () => calculateStayAmountPreview(form.startDate, form.endDate, pricePerNight),
    [form.endDate, form.startDate, pricePerNight],
  );

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
    loading,
    error,
    added,
    updateField,
    submit,
    goToCart,
    resetAdded,
  };
}
