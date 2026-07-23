import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProfileForm } from './useProfileForm';

const mockRefreshSession = vi.fn();
const mockNotifySuccess = vi.fn();
const mockExecute = vi.fn();

const mockProfile = {
  userId: 1,
  firstName: 'Jean',
  lastName: 'Dupont',
  phoneNumber: '+33601020304',
  avatar: '',
};

vi.mock('../../../auth/ui/hooks/useAuth', () => ({
  useAuth: () => ({
    session: { profile: mockProfile },
    refreshSession: mockRefreshSession,
  }),
}));

vi.mock('../../../../shared/notifications', () => ({
  useNotification: () => ({ success: mockNotifySuccess }),
}));

vi.mock('../../application/composition/account.composition', () => ({
  getUpdateProfileUseCase: () => ({ execute: mockExecute }),
}));

describe('useProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRefreshSession.mockResolvedValue(undefined);
    Object.assign(mockProfile, {
      userId: 1,
      firstName: 'Jean',
      lastName: 'Dupont',
      phoneNumber: '+33601020304',
      avatar: '',
    });
  });

  it('affiche une erreur quand la mise à jour échoue', async () => {
    mockExecute.mockResolvedValue({ success: false, error: 'Téléphone invalide' });

    const { result } = renderHook(() => useProfileForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as never);
    });

    expect(result.current.error).toBe('Téléphone invalide');
    expect(mockRefreshSession).not.toHaveBeenCalled();
  });

  it('rafraîchit la session et notifie après une mise à jour réussie', async () => {
    mockExecute.mockResolvedValue({
      success: true,
      profile: {
        userId: 1,
        firstName: 'Jean',
        lastName: 'Martin',
        phoneNumber: '0612345678',
        avatar: '',
      },
    });

    const { result } = renderHook(() => useProfileForm());

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: vi.fn() } as never);
    });

    await waitFor(() => {
      expect(mockRefreshSession).toHaveBeenCalled();
      expect(mockNotifySuccess).toHaveBeenCalledWith('Profil mis à jour.');
    });
  });
});
