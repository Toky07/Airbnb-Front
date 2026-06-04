import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AuthProvider from '../../../auth/ui/providers/AuthProvider';
import HomePage from './HomePage';

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
        <AuthProvider>
          <HomePage />
        </AuthProvider>
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
