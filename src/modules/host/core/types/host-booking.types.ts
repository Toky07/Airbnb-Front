export type HostBookingOrder = {
  paymentId: number;
  paidAt: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  previewLabel: string;
  transactionId: string;
  startDate: string | null;
  endDate: string | null;
  propertyId: number | null;
  propertyName: string | null;
  reservationId: number | null;
  reservationStatus: string | null;
  checkIn: string | null;
};

export type HostReservationStats = {
  activeCount: number;
  pendingCount: number;
  monthlyRevenue: number;
  totalRevenue: number;
  totalCount: number;
  occupancyRate: number;
};

export type HostReservationActivity = {
  id: number;
  label: string;
  totalPrice: number;
  createdAt: string;
};

export type HostReservationStatsOverview = {
  stats: HostReservationStats | null;
  recentActivity: HostReservationActivity[];
};
