import { http, HttpResponse } from 'msw';
import { sampleAuthMeApi } from '../../fixtures/auth-api.fixtures';
import { apiUrl } from '../api-base-url';

let profileState = structuredClone(sampleAuthMeApi.profile);

export function resetProfileState(): void {
  profileState = structuredClone(sampleAuthMeApi.profile);
}

export const authHandlers = [
  http.get(apiUrl('/auth/me'), () =>
    HttpResponse.json({
      ...sampleAuthMeApi,
      profile: profileState,
    }),
  ),

  http.put(apiUrl('/auth/profile'), async ({ request }) => {
    const body = await request.formData();
    profileState = {
      ...profileState,
      firstName: String(body.get('firstName') ?? profileState.firstName),
      lastName: String(body.get('lastName') ?? profileState.lastName),
      phoneNumber: String(body.get('phoneNumber') ?? profileState.phoneNumber ?? ''),
    };

    return HttpResponse.json({
      id: sampleAuthMeApi.id,
      firstName: profileState.firstName,
      lastName: profileState.lastName,
      phoneNumber: profileState.phoneNumber,
      avatar: profileState.avatar ?? '',
    });
  }),

  http.post(apiUrl('/auth/login'), async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (body.email === 'user@test.com' && body.password === 'secret') {
      return HttpResponse.json({ token: 'jwt-token' });
    }

    return HttpResponse.json({ message: 'Identifiants invalides.' }, { status: 401 });
  }),
];
