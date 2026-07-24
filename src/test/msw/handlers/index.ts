import { authHandlers } from './auth.handlers';
import { cartHandlers } from './cart.handlers';
import { favoritesHandlers } from './favorites.handlers';
import { invoicesHandlers } from './invoices.handlers';
import { messagingHandlers } from './messaging.handlers';
import { reviewsHandlers } from './reviews.handlers';
import { reservationsHandlers } from './reservations.handlers';
import { roomsHandlers } from './rooms.handlers';

export const handlers = [
  ...authHandlers,
  ...cartHandlers,
  ...favoritesHandlers,
  ...invoicesHandlers,
  ...messagingHandlers,
  ...reviewsHandlers,
  ...reservationsHandlers,
  ...roomsHandlers,
];
