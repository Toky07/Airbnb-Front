# Frontend voyageur

SPA React pour les **voyageurs** et l’**espace hôte** (recherche, fiche chambre, panier, paiement Stripe, dashboard hôte).

Stack : React 19, Vite 8, Tailwind CSS 4, React Router 7.

## Démarrage

```bash
npm ci
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm run dev            # http://localhost:5173
```

Avec Docker, depuis la racine du monorepo : `make dev`.

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement Vite |
| `npm run build` | Build production (`dist/`) |
| `npm run test` | Tests unitaires (Vitest) |
| `npm run lint` | ESLint |

## Points d’entrée

- `src/main.tsx` — bootstrap React
- `src/routes.tsx` — routes (public, auth, hôte, 404)
- `src/modules/` — modules métier (rooms, cart, reservation, host, auth…)

Documentation monorepo : [../README.md](../README.md).

## Documentation

- [docs/README.md](docs/README.md) — guides par fonctionnalité (utilisateur + technique)
- Vue globale voyageur : [../docs/utilisateur/README.md](../docs/utilisateur/README.md)
