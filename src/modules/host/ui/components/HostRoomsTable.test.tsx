import { render, screen } from '@testing-library/react';
import HostRoomsTable from './HostRoomsTable';
import type { RoomListItem } from '../../../rooms/core/types/room.types';

const room: RoomListItem = {
  id: 10,
  name: 'Suite Vue Mer',
  slug: 'suite-vue-mer',
  description: '',
  pricePerNight: 180,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  quantity: 1,
  size: 35,
  status: 'available',
  propertyId: 1,
  property: null,
  roomTypeId: 1,
  roomType: { id: 1, name: 'Suite', slug: 'suite' },
  images: [],
};

describe('HostRoomsTable', () => {
  it('affiche les chambres et les actions', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(<HostRoomsTable rooms={[room]} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('Suite Vue Mer')).toBeInTheDocument();
    expect(screen.getByText('Suite')).toBeInTheDocument();
    expect(screen.getByText('Disponible')).toBeInTheDocument();
    expect(screen.getByLabelText('Modifier Suite Vue Mer')).toBeInTheDocument();
    expect(screen.getByLabelText('Supprimer Suite Vue Mer')).toBeInTheDocument();
  });
});
