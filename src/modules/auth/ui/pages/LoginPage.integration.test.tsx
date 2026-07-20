import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithRoute } from '../../../../test/render-with-providers';
import LoginPage from './LoginPage';

describe('LoginPage (integration)', () => {
  it('connecte l’utilisateur via le formulaire et POST /auth/login', async () => {
    renderWithRoute('/login', <LoginPage />, { routerInitialEntries: ['/login'] });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'secret' },
    });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBe('jwt-token');
    });
  });

  it('affiche l’erreur API lorsque les identifiants sont invalides', async () => {
    renderWithRoute('/login', <LoginPage />, { routerInitialEntries: ['/login'] });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@test.com' },
    });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));

    await waitFor(() => {
      expect(screen.getByText('Identifiants invalides.')).toBeInTheDocument();
    });

    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
