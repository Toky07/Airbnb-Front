import { http, HttpResponse } from 'msw';
import { sampleAuthMeApi } from '../../fixtures/auth-api.fixtures';
import { apiUrl } from '../api-base-url';

export const authHandlers = [
  http.get(apiUrl('/auth/me'), () => HttpResponse.json(sampleAuthMeApi)),

  http.post(apiUrl('/auth/login'), async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email === 'user@test.com' && body.password === 'secret') {
      return HttpResponse.json({ token: 'jwt-token' });
    }

    return HttpResponse.json({ message: 'Identifiants invalides.' }, { status: 401 });
  }),
];
