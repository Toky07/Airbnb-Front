# Avis — Technique

**Module :** intégré dans `account` (MyPurchases) + affichage dans `rooms`

## Création

Depuis `MyPurchasesPage` — `POST /reviews` avec `reservationId`, `rating`, `comment`.

## Affichage public

`RoomDetailPage` consomme :

- `GET /rooms/by-slug/:slug/reviews`
- `GET /rooms/by-slug/:slug/rating-summary`

## Statuts UI

Afficher pending / approved / rejected dans l’historique voyageur.

## Admin

Modération via dashboard `backend/` — `/dashboard/reviews`.

## API

Voir [api/docs/technique/avis.md](../../../api/docs/technique/avis.md).
