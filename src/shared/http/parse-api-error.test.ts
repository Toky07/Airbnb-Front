import { describe, expect, it } from 'vitest';
import { extractApiToken, isSafeInternalRedirect, parseApiError } from './parse-api-error';

describe('parse-api-error', () => {
  it('extrait un message string', () => {
    expect(parseApiError({ message: 'Erreur' }, 'fallback')).toBe('Erreur');
  });

  it('extrait un message tableau', () => {
    expect(parseApiError({ message: ['A', 'B'] }, 'fallback')).toBe('A, B');
  });

  it('valide un redirect interne', () => {
    expect(isSafeInternalRedirect('/rooms/5')).toBe(true);
    expect(isSafeInternalRedirect('//evil.test')).toBe(false);
  });

  it('extrait un token JWT de la réponse API', () => {
    expect(extractApiToken({ token: 'jwt-token' })).toBe('jwt-token');
    expect(extractApiToken({ message: 'error' })).toBeNull();
    expect(extractApiToken(null)).toBeNull();
  });
});
