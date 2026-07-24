import type { ReactNode } from 'react';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

type PublicPageLayoutProps = {
  children: ReactNode;
};

const PublicPageLayout = ({ children }: PublicPageLayoutProps) => (
  <div className="min-h-screen bg-transparent">
    <SiteHeader />
    <main>{children}</main>
    <SiteFooter />
  </div>
);

export default PublicPageLayout;
