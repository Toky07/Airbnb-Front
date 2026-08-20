export type HelpArticle = {
  question: string;
  answer: string;
};

export const HELP_ARTICLES: HelpArticle[] = [
  {
    question: 'Comment réserver un logement ?',
    answer:
      'Choisissez des dates sur la fiche, ajoutez au panier, connectez-vous puis payez avec Stripe. Un hold de 20 minutes réserve le logement le temps du paiement. La confirmation et la facture PDF arrivent par email.',
  },
  {
    question: 'Puis-je annuler ?',
    answer:
      'Oui, depuis Mes achats, tant que la politique de l’établissement le permet (flexible, modérée ou stricte). Un aperçu du remboursement s’affiche avant confirmation. Le remboursement est déclenché via Stripe.',
  },
  {
    question: 'Où trouver les instructions d’arrivée ?',
    answer:
      'Après un paiement confirmé, ouvrez Mes achats. Le guide d’arrivée (adresse, horaires, wifi, règlement, contact d’urgence) s’affiche dès que l’hôte l’a renseigné.',
  },
  {
    question: 'Comment devenir hôte ?',
    answer:
      'Connectez-vous, ouvrez Devenir hôte, décrivez votre projet. Un administrateur examine la demande. Après acceptation, configurez Stripe Connect puis publiez votre établissement.',
  },
  {
    question: 'Le paiement a échoué ou le délai a expiré',
    answer:
      'Si le hold de 20 minutes expire avant le paiement, le logement est libéré. Revenez au panier et relancez le checkout. En cas de débit sans confirmation, contactez le support avec l’heure et l’email du compte.',
  },
];
