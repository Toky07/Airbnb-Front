import { http, HttpResponse } from 'msw';
import { apiUrl } from '../api-base-url';

export const invoicesHandlers = [
  http.get(apiUrl('/invoices/me'), () => HttpResponse.json([])),
];
