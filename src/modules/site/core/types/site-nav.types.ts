import type { SimpleNavLink } from '../../../../shared/types/nav.types';

export type NavLink = SimpleNavLink;

export type FooterColumn = {
  title: string;
  links: NavLink[];
};
