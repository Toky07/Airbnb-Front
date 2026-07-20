import { type FormEvent } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLoginForm } from './useLoginForm';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockNotifySuccess = vi.fn();
const mockExecute = vi.fn();

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [new URLSearchParams()],
}));

vi.mock('./useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

vi.mock('../../../../shared/notifications', () => ({
  useNotification: () => ({ success: mockNotifySuccess }),
  notifyMessages: {
    auth: {
      login: () => 'Connexion réussie',
    },
  },
}));

vi.mock('../../application/composition/auth.composition', () => ({
  getLoginUseCase: () => ({ execute: mockExecute }),
}));

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche une erreur lorsque le login échoue', async () => {
    mockExecute.mockResolvedValue({
      success: false,
      error: 'Identifiants invalides.',
    });

    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setEmail('user@test.com');
      result.current.setPassword('wrong');
    });

    await act(async () => {
      await result.current.submit({
        preventDefault: vi.fn(),
      } as unknown as FormEvent);
    });

    expect(result.current.error).toBe('Identifiants invalides.');
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('connecte l’utilisateur et redirige lorsque le login réussit', async () => {
    mockExecute.mockResolvedValue({ success: true, token: 'jwt-token' });
    mockLogin.mockResolvedValue({ isHost: false });

    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.setEmail('user@test.com');
      result.current.setPassword('secret');
    });

    await act(async () => {
      await result.current.submit({
        preventDefault: vi.fn(),
      } as unknown as FormEvent);
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('jwt-token');
      expect(mockNotifySuccess).toHaveBeenCalledWith('Connexion réussie');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
