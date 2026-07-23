import { useState } from 'react';
import { Button } from '../../../../shared/ui';
import {
  getReservationStatusLabel,
  type Reservation,
} from '../../../reservation/core/types/reservation.types';
import { formatPricePerNight } from '../../../rooms/core/types/room.types';
import { StayProductCard } from '../../../../shared/ui/product/StayProductCard';
import { parseProductLabel } from '../../../../shared/ui/product/parse-product-label';
import { useCancelReservation } from '../hooks/useCancelReservation';

function getStatusTone(
  status: Reservation['status'],
): 'success' | 'neutral' | 'danger' {
  if (status === 'confirmed') {
    return 'success';
  }

  if (status === 'cancelled' || status === 'no_show') {
    return 'danger';
  }

  return 'neutral';
}

function formatRefundAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

type PurchaseCardProps = {
  reservation: Reservation;
  onCancelled?: () => void;
};

export default function PurchaseCard({ reservation, onCancelled }: PurchaseCardProps) {
  const { preview, loading, error, loadPreview, cancel, reset } = useCancelReservation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fallback = parseProductLabel(`Chambre #${reservation.roomId}`);
  const canCancel =
    reservation.status === 'confirmed' && reservation.startDate > new Date().toISOString().slice(0, 10);

  const handleOpenCancel = async () => {
    const result = await loadPreview(reservation.id);
    if (result) {
      setConfirmOpen(true);
    }
  };

  const handleConfirmCancel = async () => {
    const result = await cancel(reservation.id);
    if (result.success) {
      setConfirmOpen(false);
      reset();
      onCancelled?.();
    }
  };

  return (
    <div className="space-y-4">
      <StayProductCard
        badge={`Réservation #${reservation.id}`}
        statusLabel={getReservationStatusLabel(reservation.status)}
        statusTone={getStatusTone(reservation.status)}
        details={{
          roomName: reservation.roomName ?? fallback.roomName,
          propertyName: reservation.propertyName ?? 'Établissement',
          propertyCity: reservation.propertyCity,
          imageUrl: reservation.imageUrl,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
          guestCount: reservation.guestCount,
          nights: reservation.nights,
          totalPrice: reservation.totalPrice,
          priceLabel: formatPricePerNight(reservation.totalPrice),
          roomId: reservation.roomId,
        }}
        footerLink={
          reservation.roomSlug
            ? { to: `/rooms/${reservation.roomSlug}`, label: 'Voir la chambre' }
            : undefined
        }
      />

      {canCancel ? (
        <Button type="button" variant="secondary" onClick={handleOpenCancel} disabled={loading}>
          Annuler la réservation
        </Button>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {confirmOpen && preview ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="font-medium text-slate-900">{preview.policyLabel}</p>
          <p className="mt-2 text-sm text-slate-600">
            Remboursement estimé :{' '}
            {formatRefundAmount(preview.refundAmount, preview.currency)} ({preview.refundPercent}
            %)
          </p>
          <div className="mt-4 flex gap-3">
            <Button type="button" onClick={handleConfirmCancel} disabled={loading}>
              Confirmer l&apos;annulation
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setConfirmOpen(false);
                reset();
              }}
            >
              Retour
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
