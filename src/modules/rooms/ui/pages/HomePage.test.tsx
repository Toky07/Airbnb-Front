import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AuthProvider from '../../../auth/ui/providers/AuthProvider';
import CartProvider from '../../../cart/ui/providers/CartProvider';
import { NotificationProvider } from '../../../../shared/notifications';
import HomePage from './HomePage';

vi.mock('../../../cart/core/services/cart.service', () => ({
  getCartService: () => ({
    getCart: vi.fn().mockResolvedValue({
      success: true,
      cart: {
        id: 1,
        sessionId: 'test-session',
        userId: null,
        items: [],
        totalPrice: 0,
        itemCount: 0,
      },
    }),
    merge: vi.fn().mockResolvedValue({
      success: true,
      cart: {
        id: 1,
        sessionId: 'test-session',
        userId: null,
        items: [],
        totalPrice: 0,
        itemCount: 0,
      },
    }),
    addReservation: vi.fn(),
    removeItem: vi.fn(),
    checkout: vi.fn(),
    clear: vi.fn(),
  }),
}));

const mockRooms = {
  data: [
    {
      id: 1,
      name: 'Suite vue mer',
      description: 'Belle chambre',
      pricePerNight: 120,
      maxGuests: 2,
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      quantity: 1,
      size: 35,
      status: 'available',
      propertyId: 1,
      property: {
        id: 1,
        name: 'Hôtel Azur',
        city: 'Nice',
        country: 'France',
        address: '1 Promenade',
        description: '',
        checkInTime: '15:00',
        checkOutTime: '11:00',
        propertyType: null,
      },
      roomTypeId: null,
      roomType: null,
      images: [],
    },
  ],
  meta: { page: 1, limit: 12, total: 1, totalPages: 1 },
};

describe('HomePage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('affiche le hero et charge les logements', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockRooms), { status: 200 }),
    );

    render(
      <MemoryRouter>
        <NotificationProvider>
          <AuthProvider>
            <CartProvider>
              <HomePage />
            </CartProvider>
          </AuthProvider>
        </NotificationProvider>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: /trouvez votre prochain logement/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rechercher/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Suite vue mer')).toBeInTheDocument();
    });
  });
});
