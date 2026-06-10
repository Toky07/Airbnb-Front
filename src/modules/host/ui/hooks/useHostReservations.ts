import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getHostReservationService,
  type HostBookingOrder,
  type HostReservationStats,
} from '../../core/services/host.service';
import type { PaginationMeta } from '../../../../shared/pagination/types';

const DEFAULT_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export function useHostReservations() {
  const [bookings, setBookings] = useState<HostBookingOrder[]>([]);
  const [stats, setStats] = useState<HostReservationStats | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const serviceRef = useRef(getHostReservationService());

  const loadData = useCallback(async (page = 1, searchTerm = '') => {
    setLoading(true);
    const svc = serviceRef.current;
    const [bookingsRes, statsRes] = await Promise.all([
      svc.listBookings({ page, limit: 10, search: searchTerm }),
      svc.getStats(),
    ]);
    setBookings(bookingsRes.data);
    setMeta(bookingsRes.meta);
    setStats(statsRes);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      void loadData(1, search);
    },
    [loadData, search],
  );

  const goToPage = useCallback(
    (page: number) => {
      void loadData(page, search);
    },
    [loadData, search],
  );

  return {
    bookings,
    stats,
    meta,
    search,
    loading,
    setSearch,
    handleSearch,
    goToPage,
  };
}
