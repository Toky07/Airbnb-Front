# Panier & paiement — Technique

**Module :** `frontend/src/modules/cart/`

## Page

`CartPage.tsx` — route `/cart`

## CartProvider

- Header `X-Cart-Session` pour visiteurs anonymes
- `GET/POST/PATCH/DELETE /cart/*`
- Merge automatique post-login

## Stripe

- `@stripe/react-stripe-js`, `@stripe/stripe-js`
- `POST /cart/checkout` → `clientSecret`
- Composant `PaymentForm` ou équivalent dans `ui/components/`

## Flux

```
addItem → checkout → Stripe confirm → redirect confirmation
```

## Tests

`CartPage.integration.test.tsx`

## API liée

Voir [api/docs/technique/panier.md](../../../api/docs/technique/panier.md) et [paiement.md](../../../api/docs/technique/paiement.md).
