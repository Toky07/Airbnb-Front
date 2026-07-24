# Authentification — Guide utilisateur

**Routes :** `/login`, `/register`, `/forgot-password`, `/reset-password`, `/set-password`

## Inscription

1. Remplissez email, mot de passe et informations de profil
2. Connectez-vous automatiquement ou via `/login`

## Connexion

Email + mot de passe → accès au compte, panier fusionné si session anonyme.

## Mot de passe oublié

1. `/forgot-password` — saisissez votre email
2. Cliquez le lien reçu (valide limité dans le temps)
3. `/reset-password` — choisissez un nouveau mot de passe

## Invitation (première connexion)

Si un admin vous a invité, utilisez `/set-password` avec le lien reçu par email.

## Espace hôte

Les comptes avec rôle **hôte** accèdent à `/host` après connexion.
