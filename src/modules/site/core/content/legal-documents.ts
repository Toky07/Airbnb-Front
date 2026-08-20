export type LegalDocumentId = 'cgu' | 'confidentialite' | 'mentions';

export type LegalDocument = {
  id: LegalDocumentId;
  title: string;
  updatedAt: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
};

const ISSUER_NAME =
  (import.meta.env.VITE_LEGAL_ISSUER_NAME as string | undefined)?.trim() ||
  'StayBook SAS';
const ISSUER_ADDRESS =
  (import.meta.env.VITE_LEGAL_ISSUER_ADDRESS as string | undefined)?.trim() ||
  '1 rue Example, 75001 Paris';
const ISSUER_SIRET =
  (import.meta.env.VITE_LEGAL_SIRET as string | undefined)?.trim() ||
  'Non renseigné (projet de démonstration)';
const ISSUER_EMAIL =
  (import.meta.env.VITE_SUPPORT_EMAIL as string | undefined)?.trim() ||
  'support@airbnb.dev';

const UPDATED_AT = '20 août 2026';

export const LEGAL_DOCUMENTS: Record<LegalDocumentId, LegalDocument> = {
  cgu: {
    id: 'cgu',
    title: 'Conditions générales d’utilisation',
    updatedAt: UPDATED_AT,
    sections: [
      {
        heading: 'Objet',
        paragraphs: [
          `Les présentes conditions régissent l’accès au site de réservation édité par ${ISSUER_NAME}. En créant un compte, en publiant un logement ou en payant un séjour, vous acceptez ces règles.`,
          'Cette plateforme est un projet de démonstration. Les prestations d’hébergement, les paiements Stripe et les documents (factures, emails) sont fournis à des fins de test, sauf mention contraire de l’exploitant.',
        ],
      },
      {
        heading: 'Comptes',
        paragraphs: [
          'Vous devez fournir des informations exactes (identité, email, téléphone). Le compte voyageur permet de réserver ; le rôle hôte est soumis à une candidature examinée par un administrateur.',
          'Vous êtes responsable de la confidentialité de vos identifiants. Signalez tout usage non autorisé via la page Contact.',
        ],
      },
      {
        heading: 'Réservations et paiements',
        paragraphs: [
          'Le prix affiché au checkout comprend les nuitées, la TVA, la taxe de séjour le cas échéant et les frais de service. Le paiement est encaissé via Stripe. Un hold de 20 minutes bloque le logement le temps du paiement.',
          'L’annulation suit la politique de l’établissement (flexible, modérée ou stricte). Un remboursement Stripe peut s’appliquer automatiquement selon le délai avant l’arrivée.',
        ],
      },
      {
        heading: 'Hôtes',
        paragraphs: [
          'L’hôte s’engage à décrire fidèlement le logement, à tenir le calendrier à jour et à fournir des instructions d’arrivée après confirmation. Les fonds sont versés via Stripe Connect lorsque le compte hôte est activé.',
        ],
      },
      {
        heading: 'Responsabilité',
        paragraphs: [
          `${ISSUER_NAME} met en relation voyageurs et hôtes. Sauf faute de la plateforme, les litiges liés au séjour (état des lieux, nuisances) relèvent d’abord de l’hôte et du voyageur. Un administrateur peut être contacté pour médiation.`,
        ],
      },
    ],
  },
  confidentialite: {
    id: 'confidentialite',
    title: 'Politique de confidentialité',
    updatedAt: UPDATED_AT,
    sections: [
      {
        heading: 'Données collectées',
        paragraphs: [
          'Compte : nom, email, téléphone, photo de profil. Réservations : dates, logement, nombre de voyageurs, facturation. Paiements : traités par Stripe (nous ne stockons pas le numéro de carte). Messagerie : contenu des messages liés à une réservation. Candidature hôte : ville et description du projet.',
        ],
      },
      {
        heading: 'Finalités',
        paragraphs: [
          'Exécuter le contrat de réservation, authentifier les comptes, prévenir la fraude, envoyer les emails transactionnels (mot de passe, confirmation, facture), modérer les avis et les candidatures hôte, et améliorer le service.',
        ],
      },
      {
        heading: 'Conservation et destinataires',
        paragraphs: [
          'Les données sont hébergées sur l’infrastructure de l’exploitant (base PostgreSQL, fichiers locaux pour les photos). Stripe, et éventuellement le transporteur d’emails (SMTP ou Resend), reçoivent uniquement ce qui est nécessaire au paiement et aux notifications.',
          'Durée : le temps du compte, puis archivage légal des factures. Vous pouvez demander l’accès, la rectification ou la suppression via la page Contact, sous réserve des obligations comptables.',
        ],
      },
      {
        heading: 'Cookies et géolocalisation',
        paragraphs: [
          'Le site utilise le stockage local du navigateur pour la session et le panier anonyme. La géolocalisation (« Proche de vous ») n’est demandée que si vous cliquez sur cette action, et n’est pas conservée côté serveur au-delà de la recherche.',
        ],
      },
    ],
  },
  mentions: {
    id: 'mentions',
    title: 'Mentions légales',
    updatedAt: UPDATED_AT,
    sections: [
      {
        heading: 'Éditeur',
        paragraphs: [
          `${ISSUER_NAME}`,
          ISSUER_ADDRESS,
          `SIRET : ${ISSUER_SIRET}`,
          `Contact : ${ISSUER_EMAIL}`,
        ],
      },
      {
        heading: 'Hébergement',
        paragraphs: [
          'Le site est servi en développement sur la machine de l’exploitant (API NestJS, interfaces React). En production, l’hébergeur est celui indiqué dans le contrat d’infogérance de l’exploitant.',
        ],
      },
      {
        heading: 'Propriété intellectuelle',
        paragraphs: [
          'Les textes, marques et visuels du site sont réservés. Les photos des logements appartiennent à leurs auteurs (hôtes ou banques d’images). Toute reproduction non autorisée est interdite.',
        ],
      },
    ],
  },
};

export function getLegalDocument(id: string | undefined): LegalDocument | null {
  if (id === 'cgu' || id === 'confidentialite' || id === 'mentions') {
    return LEGAL_DOCUMENTS[id];
  }
  return null;
}
