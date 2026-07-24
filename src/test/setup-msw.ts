import { afterAll, afterEach, beforeAll } from 'vitest';
import { resetProfileState } from './msw/handlers/auth.handlers';
import { resetFavoriteState } from './msw/handlers/favorites.handlers';
import { resetMessagingState } from './msw/handlers/messaging.handlers';
import { resetCartState } from './msw/state/cart.state';
import { server } from './msw/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  resetCartState();
  resetProfileState();
  resetFavoriteState();
  resetMessagingState();
  localStorage.clear();
});

afterAll(() => {
  server.close();
});
