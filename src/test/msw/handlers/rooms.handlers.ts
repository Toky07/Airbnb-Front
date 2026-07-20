import { http, HttpResponse } from 'msw';
import { sampleRoomsListApi } from '../../fixtures/rooms-api.fixtures';
import { apiUrl } from '../api-base-url';

export const roomsHandlers = [
  http.get(apiUrl('/rooms'), () => HttpResponse.json(sampleRoomsListApi)),
];
