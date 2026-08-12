import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RoomBookingPanel from './RoomBookingPanel';
import type { RoomListItem } from '../../../rooms/core/types/room.types';

const room: RoomListItem = {
  id: 5,
  name: 'Suite',
  slug: 'suite',
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
  unavailableDates: [{ startDate: '2026-09-10', endDate: '2026-09-13' }],
};

const pricingExecute = vi.fn().mockResolvedValue(null);

vi.mock('../../../rooms/application/composition/room.composition', () => ({
  getGetRoomPricingPreviewUseCase: () => ({
    execute: pricingExecute,
  }),
}));

const addReservation = vi.fn().mockResolvedValue({ success: true });

vi.mock('../../../cart/ui/hooks/useCart', () => ({
  useCart: () => ({
    addReservation,
    updateItem: vi.fn(),
    cart: null,
    isLoading: false,
    refreshCart: vi.fn(),
    syncCart: vi.fn(),
    removeItem: vi.fn(),
    itemCount: 0,
  }),
}));

async function renderBookingPanel() {
  render(
    <MemoryRouter>
      <RoomBookingPanel room={room} returnPath="/rooms/5" />
    </MemoryRouter>,
  );

  // Laisse finir l’effet pricing (setPricingLoading / setPricingBreakdown).
  await waitFor(() => {
    expect(screen.queryByText(/calcul des taxes/i)).not.toBeInTheDocument();
  });
}

async function goToMonth(targetMonthIndex: number) {
  const navNext = screen.getByLabelText('Mois suivant');
  const currentMonth = new Date().getMonth();
  let clicks = targetMonthIndex - currentMonth;
  if (clicks < 0) {
    clicks += 12;
  }

  for (let i = 0; i < clicks; i++) {
    fireEvent.click(navNext);
  }
}

function selectDate(dateStr: string) {
  fireEvent.click(screen.getByTestId(`calendar-day-${dateStr}`));
}

describe('RoomBookingPanel', () => {
  beforeEach(() => {
    pricingExecute.mockClear();
    addReservation.mockClear();
  });

  it('affiche le calendrier et le bouton ajouter au panier', async () => {
    await renderBookingPanel();

    expect(screen.getByText('Sélectionnez vos dates')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ajouter au panier/i })).toBeInTheDocument();
  });

  it('désactive les dates indisponibles et les départs en conflit', async () => {
    await renderBookingPanel();
    await goToMonth(8);

    expect(screen.getByTestId('calendar-day-2026-09-11')).toBeDisabled();

    selectDate('2026-09-08');
    expect(screen.getByTestId('calendar-day-2026-09-14')).toBeDisabled();
    expect(screen.getByRole('button', { name: /ajouter au panier/i })).toBeDisabled();
  });

  it('ajoute au panier avec des dates disponibles', async () => {
    await renderBookingPanel();
    await goToMonth(8);

    selectDate('2026-09-01');
    selectDate('2026-09-03');

    await waitFor(() => {
      expect(screen.queryByText(/calcul des taxes/i)).not.toBeInTheDocument();
    });

    const submitBtn = screen.getByRole('button', { name: /ajouter au panier/i });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

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
