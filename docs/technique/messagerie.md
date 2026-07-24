# Messagerie — Technique

**Module :** `frontend/src/modules/messaging/`

## Pages

| Route | Composant |
|-------|-----------|
| `/account/messages` | `MessagesPage` |
| `/host/messages` | `HostMessagesPage` |

## API

- `GET /conversations/me`
- `GET /conversations/:id/messages`
- `POST /conversations/:id/messages`
- `POST /conversations/:id/read`
- `POST /conversations/from-reservation/:reservationId`

## Polling

Rafraîchissement périodique des messages (intervalle configurable dans hook).

## Tests

`MessagesPage.integration.test.tsx`

## Structure UI

Layout deux colonnes : liste conversations + fil messages.
