import type { SimpleNavLink } from '../../types/nav.types';

type NavLinksProps = {
  links: SimpleNavLink[];
  className?: string;
  linkClassName?: string;
};

const NavLinks = ({
  links,
  className = '',
  linkClassName = 'text-sm font-medium text-white/80 transition duration-200 hover:text-white',
}: NavLinksProps) => (
  <nav className={className}>
    {links.map((link) => (
      <a key={link.href} href={link.href} className={linkClassName}>
        {link.label}
      </a>
    ))}
  </nav>
);

export default NavLinks;
