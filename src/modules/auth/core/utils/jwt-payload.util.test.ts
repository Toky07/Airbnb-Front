import { describe, expect, it } from 'vitest';
import { extractSessionFromToken, parseJwtPayload } from './jwt-payload.util';

function buildToken(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}

describe('jwt-payload.util', () => {
  it('extrait les rôles hôte du token', () => {
    const token = buildToken({
      sub: 1,
      email: 'host@test.com',
      roles: ['host'],
      permissions: ['host.dashboard.read'],
      isSuperAdmin: false,
    });

    const session = extractSessionFromToken(token);

    expect(session.isHost).toBe(true);
    expect(session.email).toBe('host@test.com');
  });

  it('accepte sub sous forme de chaîne', () => {
    const token = buildToken({
      sub: '42',
      email: 'host@test.com',
      roles: ['host'],
    });

    expect(parseJwtPayload(token)?.sub).toBe('42');
    expect(extractSessionFromToken(token).authId).toBe(42);
  });
});
