import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../../../shared/ui';
import type { Invoice } from '../../core/types/invoice.types';
import {
  getReservationStatusLabel,
  type Reservation,
} from '../../../reservation/core/types/reservation.types';
import { formatPricePerNight } from '../../../rooms/core/types/room.types';
import { StayProductCard } from '../../../../shared/ui/product/StayProductCard';
import { parseProductLabel } from '../../../../shared/ui/product/parse-product-label';
import { useCancelReservation } from '../hooks/useCancelReservation';
import { useContactHost } from '../../../messaging/ui/hooks/useContactHost';
import ReviewForm from '../../../review/ui/components/ReviewForm';
import { useCreateReview } from '../../../review/ui/hooks/useCreateReview';
import { canLeaveReview } from '../../../review/core/utils/review-eligibility';

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
  invoice?: Invoice | null;
  downloadingInvoice?: boolean;
  onDownloadInvoice?: (invoiceId: number) => void;
  onCancelled?: () => void;
  hasReview?: boolean;
  onReviewSubmitted?: () => void;
};

export default function PurchaseCard({
  reservation,
  invoice,
  downloadingInvoice = false,
  onDownloadInvoice,
  onCancelled,
  hasReview = false,
  onReviewSubmitted,
}: PurchaseCardProps) {
  const navigate = useNavigate();
  const { preview, loading, error, loadPreview, cancel, reset } = useCancelReservation();
  const { contactHost, loading: contactingHost, error: contactError } = useContactHost(
    reservation.id,
  );
  const { createReview } = useCreateReview();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fallback = parseProductLabel(`Chambre #${reservation.roomId}`);
  const canCancel =
    reservation.status === 'confirmed' && reservation.startDate > new Date().toISOString().slice(0, 10);
  const showReviewForm = canLeaveReview(
    reservation.status,
    reservation.endDate,
    hasReview,
  );

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

  const handleContactHost = async () => {
    const conversationId = await contactHost();
    if (conversationId) {
      navigate(`/account/messages/${conversationId}`);
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

      {reservation.status === 'confirmed' && invoice && onDownloadInvoice ? (
        <Button
          type="button"
          variant="secondary"
          disabled={downloadingInvoice}
          onClick={() => onDownloadInvoice(invoice.id)}
        >
          {downloadingInvoice ? 'Téléchargement…' : 'Télécharger la facture'}
        </Button>
      ) : null}

      {reservation.status === 'confirmed' ? (
        <Button
          type="button"
          variant="secondary"
          disabled={contactingHost}
          onClick={() => void handleContactHost()}
        >
          {contactingHost ? 'Ouverture…' : 'Contacter l’hôte'}
        </Button>
      ) : null}

      {showReviewForm ? (
        <ReviewForm
          reservationId={reservation.id}
          onSubmit={createReview}
          onSuccess={onReviewSubmitted}
        />
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {contactError ? <p className="text-sm text-red-600">{contactError}</p> : null}

      {confirmOpen && preview ? (
        <div className="surface rounded-2xl p-4">
          <p className="font-medium text-ink">{preview.policyLabel}</p>
          <p className="mt-2 text-sm text-ink/60">
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
