# Architecture Frontend

## Stack

- **React 19** + **Vite 8**
- **React Router 7** — `src/routes.tsx`
- **Tailwind CSS**
- **TanStack Query** (où applicable) pour le cache API
- **MSW** — mocks en tests

## Structure hexagonale

```
src/modules/<domaine>/
  core/              types, entités UI
  application/       use-cases, ports
  infrastructure/    repositories HTTP (fetch API)
  ui/                pages, composants, hooks, providers
```

## Providers globaux

| Provider | Rôle |
|----------|------|
| `AuthProvider` | JWT, profil, guards |
| `CartProvider` | Panier + session `X-Cart-Session` |

## Guards

| Composant | Usage |
|-----------|-------|
| `GuestRoute` | Login, register (redirige si connecté) |
| `ProtectedRoute` | Compte voyageur |
| `HostRoute` | Espace `/host` |

## Layouts

- `PublicPageLayout` — pages compte / auth
- `HostLayout` — navigation hôte

## Variables

`VITE_API_URL`, `VITE_STRIPE_PUBLISHABLE_KEY` — voir `.env.example`.

## Tests

Vitest + Testing Library — `*.integration.test.tsx`, MSW handlers dans `src/mocks/`.
