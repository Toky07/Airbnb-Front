import { type FormEvent } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createAppWrapper } from '../../../../test/render-with-providers';
import { useLoginForm } from './useLoginForm';

describe('useLoginForm (integration)', () => {
  it('connecte l’utilisateur via POST /auth/login et GET /auth/me', async () => {
    const wrapper = createAppWrapper({ routerInitialEntries: ['/login'] });
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => {
      result.current.setEmail('user@test.com');
      result.current.setPassword('secret');
    });

    await act(async () => {
      await result.current.submit({ preventDefault() {} } as FormEvent);
    });

    await waitFor(() => {
      expect(localStorage.getItem('auth_token')).toBe('jwt-token');
    });
  });

  it('affiche une erreur API lorsque les identifiants sont invalides', async () => {
    const wrapper = createAppWrapper({ routerInitialEntries: ['/login'] });
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    act(() => {
      result.current.setEmail('user@test.com');
      result.current.setPassword('wrong');
    });

    await act(async () => {
      await result.current.submit({ preventDefault() {} } as FormEvent);
    });

    expect(result.current.error).toBe('Identifiants invalides.');
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});
