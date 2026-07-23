import { authHandlers } from './auth.handlers';
import { cartHandlers } from './cart.handlers';
import { invoicesHandlers } from './invoices.handlers';
import { reservationsHandlers } from './reservations.handlers';
import { roomsHandlers } from './rooms.handlers';

export const handlers = [
  ...authHandlers,
  ...cartHandlers,
  ...invoicesHandlers,
  ...reservationsHandlers,
  ...roomsHandlers,
];
