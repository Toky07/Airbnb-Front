# Compte voyageur — Technique

**Module :** `frontend/src/modules/account/`

## Pages

| Route | Composant |
|-------|-----------|
| `/account/profile` | `ProfilePage` |
| `/account/purchases` | `MyPurchasesPage` |

## Fonctionnalités MyPurchases

- Liste `GET /reservations/me`
- Annulation `POST /reservations/me/:id/cancel`
- Aperçu remboursement
- Lien facture `GET /invoices/me/:id/download`
- Formulaire avis → module `review` (via API)

## Profile

- `PUT /auth/profile`

## Tests

`ProfilePage.integration.test.tsx`, `MyPurchasesPage.integration.test.tsx`

## MSW

Handlers reviews dans `src/mocks/` pour tests achats.
