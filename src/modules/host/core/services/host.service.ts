import { getApiClient } from '../../../../shared/http/api-client';
import { buildListQuery } from '../../../../shared/pagination/build-list-query';
import { parsePaginatedResponse } from '../../../../shared/pagination/parse-paginated-response';
import type { ListQueryParams } from '../../../../shared/pagination/types';
import {
  mapCategoryOption,
  mapHostProfile,
  mapHostProperty,
  mapRoomListItem,
  type HostProfile,
  type HostProperty,
  type PropertyFormPayload,
  type RoomFormPayload,
  type RoomListItem,
} from '../types/host.types';
import type { CategorySummary } from '../../../rooms/core/types/room.types';

function buildPropertyFormData(payload: PropertyFormPayload): FormData {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('description', payload.description);
  form.append('address', payload.address);
  form.append('city', payload.city);
  form.append('country', payload.country);
  form.append('latitude', String(payload.latitude));
  form.append('longitude', String(payload.longitude));
  form.append('checkInTime', payload.checkInTime);
  form.append('checkOutTime', payload.checkOutTime);
  if (payload.propertyTypeId) {
    form.append('propertyTypeId', String(payload.propertyTypeId));
  }
  if (payload.imageFile) {
    form.append('image', payload.imageFile);
  }
  return form;
}

function buildRoomFormData(payload: RoomFormPayload): FormData {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('description', payload.description);
  form.append('pricePerNight', String(payload.pricePerNight));
  form.append('maxGuests', String(payload.maxGuests));
  form.append('bedrooms', String(payload.bedrooms));
  form.append('bathrooms', String(payload.bathrooms));
  form.append('beds', String(payload.beds));
  form.append('quantity', String(payload.quantity));
  form.append('size', String(payload.size));
  form.append('status', payload.status);
  if (payload.roomTypeId) {
    form.append('roomTypeId', String(payload.roomTypeId));
  }
  payload.imageFiles?.forEach((file) => form.append('images', file));
  if (payload.keptImagePaths) {
    form.append('keptImages', JSON.stringify(payload.keptImagePaths));
  }
  return form;
}

async function parseError(response: Response, fallback: string): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      if (typeof record.message === 'string') {
        return record.message;
      }
      if (Array.isArray(record.message)) {
        return record.message.join(', ');
      }
    }
  } catch {
    // ignore
  }
  return fallback;
}

export class HostService {
  async getProfile(): Promise<HostProfile | null> {
    const response = await getApiClient().get('/host/profile');
    if (!response.ok) {
      return null;
    }
    const data: unknown = await response.json();
    return mapHostProfile(data);
  }

  async getProperty(): Promise<HostProperty | null> {
    const response = await getApiClient().get('/host/property');
    if (!response.ok) {
      return null;
    }
    const data: unknown = await response.json();
    if (!data) {
      return null;
    }
    return mapHostProperty(data);
  }

  async createProperty(payload: PropertyFormPayload): Promise<{ success: boolean; property?: HostProperty; error?: string }> {
    const response = await getApiClient().postFormData(
      '/host/property',
      buildPropertyFormData(payload),
    );
    if (!response.ok) {
      return { success: false, error: await parseError(response, 'Création impossible.') };
    }
    const data: unknown = await response.json();
    const property = mapHostProperty(data);
    return property ? { success: true, property } : { success: false, error: 'Réponse invalide.' };
  }

  async updateProperty(payload: PropertyFormPayload): Promise<{ success: boolean; property?: HostProperty; error?: string }> {
    const response = await getApiClient().putFormData(
      '/host/property',
      buildPropertyFormData(payload),
    );
    if (!response.ok) {
      return { success: false, error: await parseError(response, 'Modification impossible.') };
    }
    const data: unknown = await response.json();
    const property = mapHostProperty(data);
    return property ? { success: true, property } : { success: false, error: 'Réponse invalide.' };
  }

  async listRooms(params: ListQueryParams = {}) {
    const response = await getApiClient().get(`/host/rooms${buildListQuery(params)}`);
    if (!response.ok) {
      return {
        data: [] as RoomListItem[],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };
    }
    const data: unknown = await response.json();
    return parsePaginatedResponse(data, mapRoomListItem);
  }

  async createRoom(payload: RoomFormPayload): Promise<{ success: boolean; room?: RoomListItem; error?: string }> {
    const response = await getApiClient().postFormData('/host/rooms', buildRoomFormData(payload));
    if (!response.ok) {
      return { success: false, error: await parseError(response, 'Création impossible.') };
    }
    const data: unknown = await response.json();
    const room = mapRoomListItem(data);
    return room ? { success: true, room } : { success: false, error: 'Réponse invalide.' };
  }

  async updateRoom(id: number, payload: RoomFormPayload): Promise<{ success: boolean; room?: RoomListItem; error?: string }> {
    const response = await getApiClient().putFormData(`/host/rooms/${id}`, buildRoomFormData(payload));
    if (!response.ok) {
      return { success: false, error: await parseError(response, 'Modification impossible.') };
    }
    const data: unknown = await response.json();
    const room = mapRoomListItem(data);
    return room ? { success: true, room } : { success: false, error: 'Réponse invalide.' };
  }

  async deleteRoom(id: number): Promise<{ success: boolean; error?: string }> {
    const response = await getApiClient().delete(`/host/rooms/${id}`);
    if (!response.ok) {
      return { success: false, error: await parseError(response, 'Suppression impossible.') };
    }
    return { success: true };
  }

  async listPropertyTypeOptions(): Promise<CategorySummary[]> {
    const response = await getApiClient().get('/host/property-types/options');
    if (!response.ok) {
      return [];
    }
    const data: unknown = await response.json();
    return Array.isArray(data)
      ? data.map(mapCategoryOption).filter((item): item is CategorySummary => item !== null)
      : [];
  }

  async listRoomTypeOptions(): Promise<CategorySummary[]> {
    const response = await getApiClient().get('/host/room-types/options');
    if (!response.ok) {
      return [];
    }
    const data: unknown = await response.json();
    return Array.isArray(data)
      ? data.map(mapCategoryOption).filter((item): item is CategorySummary => item !== null)
      : [];
  }
}

export type HostBookingItem = {
  id: number;
  roomName: string | null;
  propertyName: string | null;
  propertyCity: string | null;
  startDate: string;
  endDate: string;
  guestCount: number;
  nights: number;
  totalPrice: number;
  status: string;
  imageUrl: string | null;
};

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
};

export type HostReservationStats = {
  activeCount: number;
  pendingCount: number;
  monthlyRevenue: number;
  totalCount: number;
};

function mapBookingOrder(data: unknown): HostBookingOrder | null {
  if (!data || typeof data !== 'object') return null;
  const r = data as Record<string, unknown>;
  if (typeof r.paymentId !== 'number') return null;
  return {
    paymentId: r.paymentId,
    paidAt: String(r.paidAt ?? ''),
    amount: Number(r.amount ?? 0),
    currency: String(r.currency ?? 'eur'),
    paymentStatus: String(r.paymentStatus ?? 'pending'),
    customerName: String(r.customerName ?? 'Client'),
    customerEmail: String(r.customerEmail ?? ''),
    itemCount: Number(r.itemCount ?? 0),
    previewLabel: String(r.previewLabel ?? ''),
    transactionId: String(r.transactionId ?? ''),
  };
}

function mapReservationStats(data: unknown): HostReservationStats | null {
  if (!data || typeof data !== 'object') return null;
  const r = data as Record<string, unknown>;
  return {
    activeCount: Number(r.activeCount ?? 0),
    pendingCount: Number(r.pendingCount ?? 0),
    monthlyRevenue: Number(r.monthlyRevenue ?? 0),
    totalCount: Number(r.totalCount ?? 0),
  };
}

export class HostReservationService {
  async listBookings(params: ListQueryParams = {}) {
    const response = await getApiClient().get(`/reservations/bookings/host${buildListQuery(params)}`);
    if (!response.ok) {
      return { data: [] as HostBookingOrder[], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
    }
    const data: unknown = await response.json();
    return parsePaginatedResponse(data, mapBookingOrder);
  }

  async getStats(): Promise<HostReservationStats | null> {
    const response = await getApiClient().get('/reservations/stats');
    if (!response.ok) return null;
    const data: unknown = await response.json();
    return mapReservationStats(data);
  }
}

let reservationService: HostReservationService | null = null;

export function getHostReservationService(): HostReservationService {
  if (!reservationService) {
    reservationService = new HostReservationService();
  }
  return reservationService;
}

let service: HostService | null = null;

export function getHostService(): HostService {
  if (!service) {
    service = new HostService();
  }
  return service;
}
