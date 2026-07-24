import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, NavLink, Outlet } from 'react-router';
import { BrandLogo, UserMenu } from '../../shared/ui';
import { useAuth } from '../../modules/auth/ui/hooks/useAuth';
import HostPropertyProvider from '../../modules/host/ui/providers/HostPropertyProvider';
import { notifyMessages, useNotification } from '../../shared/notifications';

const navItems: { to: string; label: string; icon: IconProp; end?: boolean }[] = [
  { to: '/host', label: 'Tableau de bord', icon: 'table-columns', end: true },
  { to: '/host/reservations', label: 'Réservations', icon: 'calendar-check' },
  { to: '/host/messages', label: 'Messages', icon: 'envelope' },
  { to: '/host/property', label: 'Mes établissements', icon: 'hotel' },
];

const HostLayout = () => {
  const { session, email, canAccessHostDashboard, hostAccess, logout } = useAuth();
  const { success: notifySuccess } = useNotification();

  const handleLogout = () => {
    logout();
    notifySuccess(notifyMessages.auth.logout());
  };

  return (
    <HostPropertyProvider>
      <div className="flex min-h-screen bg-canvas font-sans">
        <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-ink/8 bg-surface/90 backdrop-blur-sm">
          <div className="flex h-20 items-center border-b border-ink/6 px-8">
            <BrandLogo />
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <p className="mb-6 px-2 font-display text-xs font-bold uppercase tracking-widest text-ink/40">
              Administration
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition duration-200',
                      isActive
                        ? 'bg-brand/10 text-brand'
                        : 'text-ink/50 hover:bg-mist hover:text-ink',
                    ].join(' ')
                  }
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="border-t border-ink/6 p-6">
            <Link
              to="/"
              className="flex w-full items-center justify-center rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium text-ink/70 transition duration-200 hover:border-ink/20 hover:bg-mist hover:text-ink"
            >
              Retour au site
            </Link>
          </div>
        </aside>

        <div className="ml-72 flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-20 items-center justify-end border-b border-ink/8 bg-surface/75 px-8 backdrop-blur-md">
            <UserMenu
              session={session}
              email={email}
              canAccessHostDashboard={canAccessHostDashboard}
              hasProperty={Boolean(hostAccess?.hasProperty)}
              onLogout={handleLogout}
            />
          </header>
          <main className="page-mist mx-auto w-full flex-1 p-8 lg:p-12">
            <Outlet />
          </main>
        </div>
      </div>
    </HostPropertyProvider>
  );
};

export default HostLayout;
