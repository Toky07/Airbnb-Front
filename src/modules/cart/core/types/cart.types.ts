export type CartItemType = 'reservation' | 'service';

export type CartItem = {
  id: number;
  itemType: CartItemType;
  label: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  propertyId: number | null;
  roomId: number | null;
  serviceId: number | null;
  startDate: string | null;
  endDate: string | null;
  guestCount: number | null;
  nights: number | null;
  roomName: string | null;
  propertyName: string | null;
  propertyCity: string | null;
  imageUrl: string | null;
};

export type Cart = {
  id: number;
  sessionId: string;
  userId: number | null;
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
};

export type AddReservationToCartPayload = {
  itemType: 'reservation';
  roomId: number;
  startDate: string;
  endDate: string;
  guestCount: number;
};

export function mapCartItem(data: unknown): CartItem | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (typeof record.id !== 'number' || typeof record.label !== 'string') {
    return null;
  }

  return {
    id: record.id,
    itemType: record.itemType === 'service' ? 'service' : 'reservation',
    label: record.label,
    unitPrice: Number(record.unitPrice ?? 0),
    totalPrice: Number(record.totalPrice ?? 0),
    quantity: Number(record.quantity ?? 1),
    propertyId: typeof record.propertyId === 'number' ? record.propertyId : null,
    roomId: typeof record.roomId === 'number' ? record.roomId : null,
    serviceId: typeof record.serviceId === 'number' ? record.serviceId : null,
    startDate: typeof record.startDate === 'string' ? record.startDate : null,
    endDate: typeof record.endDate === 'string' ? record.endDate : null,
    guestCount: typeof record.guestCount === 'number' ? record.guestCount : null,
    nights: typeof record.nights === 'number' ? record.nights : null,
    roomName: typeof record.roomName === 'string' ? record.roomName : null,
    propertyName: typeof record.propertyName === 'string' ? record.propertyName : null,
    propertyCity: typeof record.propertyCity === 'string' ? record.propertyCity : null,
    imageUrl: typeof record.imageUrl === 'string' ? record.imageUrl : null,
  };
}

export function mapCart(data: unknown): Cart | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (typeof record.id !== 'number' || typeof record.sessionId !== 'string') {
    return null;
  }

  const items = Array.isArray(record.items)
    ? record.items
        .map((item) => mapCartItem(item))
        .filter((item): item is CartItem => item != null)
    : [];

  return {
    id: record.id,
    sessionId: record.sessionId,
    userId: typeof record.userId === 'number' ? record.userId : null,
    items,
    totalPrice: Number(record.totalPrice ?? 0),
    itemCount: Number(record.itemCount ?? 0),
  };
}

export function formatCartPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
