import type { FooterColumn } from '../types/site-nav.types';

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
      { label: 'Centre d’aide', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Hébergement',
    links: [
      { label: 'Devenir hôte', href: '/become-host' },
      { label: 'Espace admin', href: 'http://localhost:5173' },
    ],
  },
];

export const footerLegalLinks = [
  { label: 'Confidentialité', href: '#' },
  { label: 'Conditions', href: '#' },
];
