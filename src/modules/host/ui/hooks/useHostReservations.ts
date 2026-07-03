import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getHostReservationService,
  getHostService,
} from '../../core/services/host.service';
import type {
  HostBookingOrder,
  HostReservationStats,
} from '../../core/types/host-booking.types';
import type { HostProperty } from '../../core/types/host.types';
import type { PaginationMeta } from '../../../../shared/pagination/types';

const DEFAULT_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

export function useHostReservations() {
  const [bookings, setBookings] = useState<HostBookingOrder[]>([]);
  const [properties, setProperties] = useState<HostProperty[]>([]);
  const [stats, setStats] = useState<HostReservationStats | null>(null);
  const [meta, setMeta] = useState<PaginationMeta>(DEFAULT_META);
  const [search, setSearch] = useState('');
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const serviceRef = useRef(getHostReservationService());

  const loadData = useCallback(async (page = 1, searchTerm = '', selectedPropertyId: number | null = null) => {
    setLoading(true);
    const svc = serviceRef.current;
    const hostService = getHostService();
    const [bookingsRes, statsRes, propertyList] = await Promise.all([
      svc.listBookings({
        page,
        limit: 10,
        search: searchTerm,
        ...(selectedPropertyId ? { propertyId: selectedPropertyId } : {}),
      }),
      svc.getStats(),
      hostService.listProperties(),
    ]);

    setBookings(bookingsRes.data);
    setMeta(bookingsRes.meta);
    setStats(statsRes);
    setProperties(propertyList);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadData(1, '', propertyId);
  }, [loadData, propertyId]);

  const handleSearch = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      void loadData(1, search, propertyId);
    },
    [loadData, propertyId, search],
  );

  const goToPage = useCallback(
    (page: number) => {
      void loadData(page, search, propertyId);
    },
    [loadData, propertyId, search],
  );

  return {
    bookings,
    properties,
    stats,
    meta,
    search,
    propertyId,
    loading,
    setSearch,
    setPropertyId,
    handleSearch,
    goToPage,
  };
}
