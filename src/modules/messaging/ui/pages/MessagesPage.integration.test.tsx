import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRoute } from '../../../../test/render-with-providers';
import MessagesPage from './MessagesPage';

describe('MessagesPage integration', () => {
  it('renders conversations and messages', async () => {
    localStorage.setItem('auth_token', 'jwt-token');

    await renderWithRoute('/account/messages/:conversationId', <MessagesPage />, {
      routerInitialEntries: ['/account/messages/1'],
    });

    await waitFor(() => {
      expect(screen.getByText('Mes messages')).toBeInTheDocument();
      expect(screen.getByText('Réservation #10')).toBeInTheDocument();
      expect(screen.getByText('Bonjour')).toBeInTheDocument();
    });
  });
});
