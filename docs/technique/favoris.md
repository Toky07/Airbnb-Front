# Favoris — Technique

**Module :** `frontend/src/modules/favorite/`

## Composants

| Fichier | Rôle |
|---------|------|
| `FavoriteButton.tsx` | Toggle cœur sur fiche chambre |
| `FavoritesPage.tsx` | `/account/favorites` |

## API

- `GET /favorites/me`
- `POST /favorites` `{ roomId }`
- `DELETE /favorites/:roomId`
- `GET /favorites/check?roomId=`

## Use-cases

`list-favorites`, `add-favorite`, `remove-favorite`, `check-favorite`

## Tests

`FavoritesPage.integration.test.tsx`
