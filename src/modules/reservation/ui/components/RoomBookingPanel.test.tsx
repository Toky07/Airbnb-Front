import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import RoomBookingPanel from './RoomBookingPanel';
import type { RoomListItem } from '../../../rooms/core/types/room.types';

const room: RoomListItem = {
  id: 5,
  name: 'Suite',
  description: 'Belle suite',
  pricePerNight: 100,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  quantity: 1,
  size: 30,
  status: 'available',
  propertyId: 1,
  property: {
    id: 1,
    name: 'Hôtel',
    city: 'Paris',
    country: 'France',
    address: '1 rue Test',
    description: '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    propertyType: null,
  },
  roomTypeId: null,
  roomType: null,
  images: [],
};

const addReservation = vi.fn().mockResolvedValue({ success: true });

vi.mock('../../../cart/ui/hooks/useCart', () => ({
  useCart: () => ({
    addReservation,
    cart: null,
    isLoading: false,
    refreshCart: vi.fn(),
    syncCart: vi.fn(),
    removeItem: vi.fn(),
    itemCount: 0,
  }),
}));

describe('RoomBookingPanel', () => {
  it('affiche le formulaire de réservation', () => {
    render(
      <MemoryRouter>
        <RoomBookingPanel room={room} returnPath="/rooms/5" />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Arrivée')).toBeInTheDocument();
    expect(screen.getByLabelText('Départ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter au panier/i })).toBeInTheDocument();
  });

  it('ajoute au panier sans connexion', async () => {
    addReservation.mockClear();

    render(
      <MemoryRouter>
        <RoomBookingPanel room={room} returnPath="/rooms/5" />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText('Arrivée'), {
      target: { value: '2026-09-01' },
    });
    fireEvent.change(screen.getByLabelText('Départ'), {
      target: { value: '2026-09-03' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ajouter au panier/i }));

    await waitFor(() => {
      expect(addReservation).toHaveBeenCalledWith({
        roomId: 5,
        startDate: '2026-09-01',
        endDate: '2026-09-03',
        guestCount: 1,
      });
    });

    expect(screen.getByText(/ajouté au panier/i)).toBeInTheDocument();
  });
});
