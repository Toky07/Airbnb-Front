import { http, HttpResponse } from 'msw';
import { apiUrl } from '../api-base-url';
import {
  sampleConversationApi,
  sampleMessageApi,
} from '../../fixtures/messaging-api.fixtures';

let conversations = [structuredClone(sampleConversationApi)];
let messages = [structuredClone(sampleMessageApi)];

export function resetMessagingState(): void {
  conversations = [structuredClone(sampleConversationApi)];
  messages = [structuredClone(sampleMessageApi)];
}

export const messagingHandlers = [
  http.get(apiUrl('/conversations/me'), () => HttpResponse.json(conversations)),

  http.post(apiUrl('/conversations/from-reservation/:reservationId'), ({ params }) => {
    const existing = conversations.find(
      (conversation) => conversation.reservationId === Number(params.reservationId),
    );

    if (existing) {
      return HttpResponse.json(existing);
    }

    const created = {
      ...structuredClone(sampleConversationApi),
      id: conversations.length + 1,
      reservationId: Number(params.reservationId),
    };
    conversations.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.get(apiUrl('/conversations/:id/messages'), ({ params }) => {
    const filtered = messages.filter(
      (message) => message.conversationId === Number(params.id),
    );
    return HttpResponse.json(filtered);
  }),

  http.post(apiUrl('/conversations/:id/messages'), async ({ params, request }) => {
    const body = (await request.json()) as { body?: string };
    const created = {
      ...structuredClone(sampleMessageApi),
      id: messages.length + 1,
      conversationId: Number(params.id),
      body: body.body ?? '',
    };
    messages.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.post(apiUrl('/conversations/:id/read'), () => new HttpResponse(null, { status: 204 })),
];
