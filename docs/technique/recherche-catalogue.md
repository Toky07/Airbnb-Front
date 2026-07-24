# Recherche & catalogue — Technique

**Module :** `frontend/src/modules/rooms/`

## Pages

| Fichier | Route |
|---------|-------|
| `HomePage.tsx` | `/` |
| `SearchPage.tsx` | `/search` |
| `RoomDetailPage.tsx` | `/rooms/:slug` |

## Composants clés

| Composant | Rôle |
|-----------|------|
| `AdvancedFiltersPanel` | Filtres prix, ville, équipements, voyageurs |
| `HomeCategoryNav` | Pills catégories + géolocalisation |
| `SearchMapView` | Carte Leaflet / OpenStreetMap |
| `RoomCard` | Carte résultat liste |

## Hooks & utils

- `useSearchQueryParams` — synchro URL ↔ filtres
- Repository : `room.repository.ts` → `GET /rooms`, `GET /rooms/by-slug/:slug`

## Dépendances geo

```json
"leaflet", "react-leaflet", "@types/leaflet"
```

En Docker : `make dev-fresh` si le volume `node_modules` est obsolète.

## Tests

`SearchPage.integration.test.tsx`, `HomePage.integration.test.tsx`
