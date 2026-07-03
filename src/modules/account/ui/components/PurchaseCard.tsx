import {
  getReservationStatusLabel,
  type Reservation,
} from '../../../reservation/core/types/reservation.types';
import { formatPricePerNight } from '../../../rooms/core/types/room.types';
import { StayProductCard } from '../../../../shared/ui/product/StayProductCard';
import { parseProductLabel } from '../../../../shared/ui/product/parse-product-label';

function getStatusTone(
  status: Reservation['status'],
): 'success' | 'neutral' | 'danger' {
  if (status === 'confirmed') {
    return 'success';
  }

  if (status === 'cancelled') {
    return 'danger';
  }

  return 'neutral';
}

export default function PurchaseCard({ reservation }: { reservation: Reservation }) {
  const fallback = parseProductLabel(`Chambre #${reservation.roomId}`);

  return (
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
  );
}
