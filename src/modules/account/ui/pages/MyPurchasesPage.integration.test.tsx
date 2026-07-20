import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { sampleReservationItemApi } from '../../../../test/fixtures/reservation-api.fixtures';
import { emptyReservationsHandler } from '../../../../test/msw/handlers/reservations.handlers';
import { server } from '../../../../test/msw/server';
import { renderWithRoute } from '../../../../test/render-with-providers';
import MyPurchasesPage from './MyPurchasesPage';

describe('MyPurchasesPage (integration)', () => {
  it('affiche les réservations via GET /reservations/me', async () => {
    localStorage.setItem('auth_token', 'jwt-token');

    await renderWithRoute('/account/purchases', <MyPurchasesPage />, {
      routerInitialEntries: ['/account/purchases'],
    });

    await waitFor(() => {
      expect(screen.getByText(sampleReservationItemApi.roomName)).toBeInTheDocument();
      expect(screen.getByText('Confirmée')).toBeInTheDocument();
    });
  });

  it('affiche un état vide lorsque l’utilisateur n’a pas de réservation', async () => {
    localStorage.setItem('auth_token', 'jwt-token');
    server.use(emptyReservationsHandler());

    await renderWithRoute('/account/purchases', <MyPurchasesPage />, {
      routerInitialEntries: ['/account/purchases'],
    });

    await waitFor(() => {
      expect(screen.getByText(/pas encore de réservation payée/i)).toBeInTheDocument();
    });
  });
});
