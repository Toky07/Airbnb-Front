export const notifyMessages = {
  auth: {
    registered: () =>
      'Inscription enregistrée ! Consultez votre email pour activer votre compte.',
    login: () => 'Connexion réussie. Bienvenue !',
    passwordSet: () => 'Mot de passe défini. Vous pouvez vous connecter.',
    logout: () => 'Vous êtes déconnecté.',
  },
  property: {
    created: (name: string) => `Votre établissement « ${name} » a été créé.`,
    updated: (name: string) => `Votre établissement « ${name} » a été mis à jour.`,
  },
  room: {
    created: (name: string) => `La chambre « ${name} » a été créée.`,
    updated: (name: string) => `La chambre « ${name} » a été mise à jour.`,
    deleted: (name: string) => `La chambre « ${name} » a été supprimée.`,
  },
  booking: {
    confirmed: () => 'Paiement confirmé ! Votre réservation est validée.',
  },
} as const;
