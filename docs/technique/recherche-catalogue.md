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

En Docker : `make npm-frontend PKG=leaflet` (ou `make sync-deps` si le lockfile a déjà changé).

## Tests

`SearchPage.integration.test.tsx`, `HomePage.integration.test.tsx`
