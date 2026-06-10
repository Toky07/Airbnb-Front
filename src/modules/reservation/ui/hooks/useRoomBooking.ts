import { type FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../auth/ui/hooks/useAuth';
import { getPaymentService } from '../../../payment/core/services/payment.service';
import type { PaymentIntentResult } from '../../../payment/core/types/payment.types';
import { getReservationService } from '../../core/services/reservation.service';
import type { BookingFormValues, Reservation } from '../../core/types/reservation.types';
import { calculateStayAmountPreview } from '../../core/utils/calculate-stay-amount';

export type BookingStep = 'form' | 'payment' | 'success';

type UseRoomBookingOptions = {
  roomId: number;
  pricePerNight: number;
  maxGuests: number;
  returnPath: string;
};

export function useRoomBooking({
  roomId,
  pricePerNight,
  maxGuests,
  returnPath,
}: UseRoomBookingOptions) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState<BookingFormValues>({
    startDate: '',
    endDate: '',
    guestCount: 1,
  });
  const [step, setStep] = useState<BookingStep>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResult | null>(null);

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
  };

  const requireAuthentication = (): boolean => {
    if (isAuthenticated) {
      return true;
    }

    navigate(`/login?redirect=${encodeURIComponent(returnPath)}`);
    return false;
  };

  const startBooking = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!requireAuthentication()) {
      return;
    }

    if (form.guestCount > maxGuests) {
      setError(`Cette chambre accepte au maximum ${maxGuests} voyageurs.`);
      return;
    }

    if (!preview) {
      setError('Veuillez sélectionner des dates de séjour valides.');
      return;
    }

    setLoading(true);

    const reservationResult = await getReservationService().create({
      roomId,
      startDate: form.startDate,
      endDate: form.endDate,
      guestCount: form.guestCount,
    });

    if (!reservationResult.success) {
      setLoading(false);
      setError(reservationResult.error);
      return;
    }

    const paymentResult = await getPaymentService().createIntent({
      reservationId: reservationResult.reservation.id,
    });

    setLoading(false);

    if (!paymentResult.success) {
      setError(paymentResult.error);
      return;
    }

    setReservation(reservationResult.reservation);
    setPaymentIntent(paymentResult.intent);
    setStep('payment');
  };

  const completePayment = () => {
    setStep('success');
    setError(null);
  };

  const resetBooking = () => {
    setStep('form');
    setReservation(null);
    setPaymentIntent(null);
    setError(null);
  };

  return {
    form,
    preview,
    step,
    loading,
    error,
    reservation,
    paymentIntent,
    updateField,
    startBooking,
    completePayment,
    resetBooking,
    requireAuthentication,
  };
}
