# Authentification — Technique

**Module :** `frontend/src/modules/auth/`

## Pages

| Route | Composant |
|-------|-----------|
| `/login` | `LoginPage` |
| `/register` | `RegisterPage` |
| `/forgot-password` | `ForgotPasswordPage` |
| `/reset-password` | `ResetPasswordPage` |
| `/set-password` | `SetPasswordPage` |

## Use-cases

- `login.use-case.ts`, `register.use-case.ts`
- `forgot-password.use-case.ts`, `reset-password.use-case.ts`

## AuthProvider

- Stocke JWT (localStorage / memory selon implémentation)
- Expose `user`, `login`, `logout`, `isHost`
- Déclenche merge panier à la connexion

## API

`POST /auth/login`, `/register`, `/forgot-password`, `/reset-password`, `GET /auth/me`

## Tests

`LoginPage.integration.test.tsx`
