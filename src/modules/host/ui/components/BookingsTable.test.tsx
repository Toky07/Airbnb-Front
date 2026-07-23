import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BookingsTable from './BookingsTable';
import type { HostBookingOrder } from '../../core/types/host-booking.types';

vi.mock('../../application/reservation/composition/host-reservation.composition', () => ({
  getCancelHostReservationUseCase: () => ({
    execute: vi.fn().mockResolvedValue({ success: true }),
  }),
  getMarkHostReservationNoShowUseCase: () => ({
    execute: vi.fn().mockResolvedValue({ success: true }),
  }),
}));

const booking: HostBookingOrder = {
  paymentId: 9,
  paidAt: '2026-06-02T10:00:00.000Z',
  amount: 200,
  currency: 'eur',
  paymentStatus: 'succeeded',
  customerName: 'Jean Dupont',
  customerEmail: 'jean@example.com',
  itemCount: 1,
  previewLabel: 'Suite Deluxe · Hotel Test',
  transactionId: 'pi_test_123456',
  startDate: '2026-08-01',
  endDate: '2026-08-03',
  propertyId: 1,
  propertyName: 'Hotel Test',
  reservationId: 12,
  reservationStatus: 'confirmed',
  checkIn: '2099-01-01',
};

describe('BookingsTable', () => {
  it('affiche une commande mappée depuis l’API', () => {
    render(<BookingsTable bookings={[booking]} loading={false} />);

    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('jean@example.com')).toBeInTheDocument();
    expect(screen.getByText('Suite Deluxe · Hotel Test')).toBeInTheDocument();
    expect(screen.getByText('Payée')).toBeInTheDocument();
  });

  it('affiche l’état vide', () => {
    render(<BookingsTable bookings={[]} loading={false} />);
    expect(screen.getByText('Aucune réservation')).toBeInTheDocument();
  });
});
