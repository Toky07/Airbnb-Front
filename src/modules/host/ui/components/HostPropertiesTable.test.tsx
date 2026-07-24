import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import HostPropertiesTable from './HostPropertiesTable';
import type { HostProperty } from '../../core/types/host.types';

const properties: HostProperty[] = [
  {
    id: 1,
    name: 'Hôtel Riviera',
    description: '',
    address: '12 rue de la Mer',
    city: 'Nice',
    country: 'France',
    latitude: 0,
    longitude: 0,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    ownerId: 5,
    propertyTypeId: 1,
    propertyType: { id: 1, name: 'Hôtel', slug: 'hotel' },
    image: null,
    roomCount: 4,
    cancellationPolicy: 'moderate',
    touristTaxPerGuestNight: 0,
  },
];

describe('HostPropertiesTable', () => {
  it('affiche les colonnes et les données de l’établissement', () => {
    render(
      <MemoryRouter>
        <HostPropertiesTable properties={properties} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Établissement')).toBeInTheDocument();
    expect(screen.getByText('Localisation')).toBeInTheDocument();
    expect(screen.getByText('Chambres')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Hôtel Riviera')).toBeInTheDocument();
    expect(screen.getByText('Nice, France')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Gérer/i })).toHaveAttribute('href', '/host/property/1');
  });
});
