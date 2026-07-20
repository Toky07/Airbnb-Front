import { authHandlers } from './auth.handlers';
import { cartHandlers } from './cart.handlers';
import { roomsHandlers } from './rooms.handlers';

export const handlers = [...authHandlers, ...cartHandlers, ...roomsHandlers];
