import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { sampleAuthMeApi } from '../../../../test/fixtures/auth-api.fixtures';
import { renderWithRoute } from '../../../../test/render-with-providers';
import ProfilePage from './ProfilePage';

describe('ProfilePage (integration)', () => {
  it('préremplit le formulaire via GET /auth/me', async () => {
    localStorage.setItem('auth_token', 'jwt-token');

    await renderWithRoute('/account/profile', <ProfilePage />, {
      routerInitialEntries: ['/account/profile'],
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue(sampleAuthMeApi.profile.firstName)).toBeInTheDocument();
      expect(screen.getByDisplayValue(sampleAuthMeApi.profile.lastName)).toBeInTheDocument();
    });
  });

  it('met à jour le profil via PUT /auth/profile', async () => {
    localStorage.setItem('auth_token', 'jwt-token');

    await renderWithRoute('/account/profile', <ProfilePage />, {
      routerInitialEntries: ['/account/profile'],
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue(sampleAuthMeApi.profile.firstName)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/^nom$/i), {
      target: { value: 'Martin' },
    });
    fireEvent.change(screen.getByLabelText(/téléphone/i), {
      target: { value: '0612345678' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enregistrer/i }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('Martin')).toBeInTheDocument();
      expect(screen.getByLabelText(/téléphone/i)).toHaveValue('06 12 34 56 78');
    });
  });
});
