import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import PurchaseCard from './PurchaseCard';
import type { Reservation } from '../../../reservation/core/types/reservation.types';

const reservation: Reservation = {
  id: 12,
  itemId: 34,
  roomId: 5,
  userId: 1,
  paymentId: null,
  startDate: '2099-06-01',
  endDate: '2099-06-03',
  guestCount: 2,
  totalPrice: 200,
  nights: 2,
  status: 'confirmed',
  roomName: 'Suite',
  roomSlug: 'suite',
  propertyName: 'Hôtel',
  propertyCity: 'Paris',
  imageUrl: null,
  arrivalGuide: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const loadPreview = vi.fn().mockResolvedValue({
  reservationId: 12,
  refundAmount: 20_000,
  refundPercent: 100,
  policyLabel: 'Annulation modérée',
  cancellationPolicy: 'moderate',
  paymentAmount: 20_000,
  currency: 'eur',
});

vi.mock('../hooks/useCancelReservation', () => ({
  useCancelReservation: () => ({
    preview: null,
    loading: false,
    error: null,
    loadPreview,
    cancel: vi.fn(),
    reset: vi.fn(),
  }),
}));

describe('PurchaseCard', () => {
  const renderCard = () =>
    render(
      <MemoryRouter>
        <PurchaseCard reservation={reservation} onCancelled={vi.fn()} />
      </MemoryRouter>,
    );

  it('propose l’annulation pour une réservation confirmée future', () => {
    renderCard();

    expect(screen.getByRole('button', { name: /annuler/i })).toBeInTheDocument();
  });

  it('affiche le guide d’arrivée pour une réservation confirmée', () => {
    render(
      <MemoryRouter>
        <PurchaseCard
          reservation={{
            ...reservation,
            arrivalGuide: {
              address: '12 rue de la Mer, Nice',
              checkInTime: '15:00',
              checkOutTime: '11:00',
              houseRules: 'Pas de fête',
              checkInInstructions: 'Boîte à clés',
              wifiName: 'Riviera-Guest',
              wifiPassword: 'azerty',
              emergencyContact: '+33601020304',
            },
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Instructions d’arrivée')).toBeInTheDocument();
    expect(screen.getByText('Riviera-Guest')).toBeInTheDocument();
    expect(screen.getByText('azerty')).toBeInTheDocument();
  });
});
