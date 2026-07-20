import { http, HttpResponse } from 'msw';
import {
  emptyReservationsListApi,
  sampleReservationsListApi,
} from '../../fixtures/reservation-api.fixtures';
import { apiUrl } from '../api-base-url';

export const reservationsHandlers = [
  http.get(apiUrl('/reservations/me'), () => HttpResponse.json(sampleReservationsListApi)),
];

export function emptyReservationsHandler() {
  return http.get(apiUrl('/reservations/me'), () => HttpResponse.json(emptyReservationsListApi));
}
