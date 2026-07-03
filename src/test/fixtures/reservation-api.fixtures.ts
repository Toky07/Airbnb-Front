export const sampleReservationItemApi = {
  id: 7,
  reservationId: 12,
  roomId: 3,
  checkIn: '2026-08-01',
  checkOut: '2026-08-03',
  startDate: '2026-08-01',
  endDate: '2026-08-03',
  guestCount: 2,
  price: 200,
  nights: 2,
  roomName: 'Suite Deluxe',
  roomSlug: 'suite-deluxe',
  propertyName: 'Hotel Test',
  propertyCity: 'Paris',
  imageUrl: 'uploads/1/room/3/photo.jpg',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

export const sampleReservationOutputApi = {
  id: 12,
  userId: 5,
  status: 'confirmed',
  items: [sampleReservationItemApi],
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
};

export const sampleBookingOrderListItemApi = {
  paymentId: 9,
  paidAt: '2026-06-02T10:00:00.000Z',
  amount: 200,
  currency: 'eur',
  paymentStatus: 'succeeded',
  itemCount: 1,
  customerName: 'Jean Dupont',
  customerEmail: 'jean@example.com',
  previewLabel: 'Suite Deluxe · Hotel Test',
  transactionId: 'pi_test_123456',
  startDate: '2026-08-01',
  endDate: '2026-08-03',
};
