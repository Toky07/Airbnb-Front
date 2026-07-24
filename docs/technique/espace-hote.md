# Espace hôte — Technique

**Module :** `frontend/src/modules/host/`

## Pages & routes

| Route | Composant |
|-------|-----------|
| `/host` | `HostDashboardPage` |
| `/host/property` | `HostPropertiesListPage` |
| `/host/property/new` | `HostPropertyCreatePage` |
| `/host/property/:id` | `HostPropertyDetailPage` |
| `/host/reservations` | `HostReservationsPage` |

## Layout

`src/layout/host/HostLayout.tsx` — sidebar navigation hôte.

## API

Préfixe `/host/*` — voir [api/docs/technique/espace-hote-api.md](../../../api/docs/technique/espace-hote-api.md).

## Guard

`HostRoute` vérifie le rôle hôte via `AuthProvider`.

## Fonctionnalités UI

- CRUD établissements et chambres
- Upload photos (module media)
- Calendrier dates bloquées
- Tarifs overrides
- Annulation / no-show réservations
