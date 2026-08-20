import type { FooterColumn } from '../types/site-nav.types';
import { SITE_PATHS } from './site-urls';

export const footerColumns: FooterColumn[] = [
  {
    title: 'Découvrir',
    links: [
      { label: 'Accueil', href: '/' },
      { label: 'Tous les logements', href: '/search' },
    ],
  },
  {
    title: 'Assistance',
    links: [
      { label: 'Centre d’aide', href: SITE_PATHS.help },
      { label: 'Contact', href: SITE_PATHS.contact },
    ],
  },
  {
    title: 'Hébergement',
    links: [
      { label: 'Devenir hôte', href: '/become-host' },
    ],
  },
];

export const footerLegalLinks = [
  { label: 'Confidentialité', href: SITE_PATHS.privacy },
  { label: 'Conditions', href: SITE_PATHS.terms },
  { label: 'Mentions légales', href: SITE_PATHS.legalNotice },
];
