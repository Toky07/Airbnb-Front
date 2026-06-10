import { faCalendarCheck, faHotel, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, NavLink, Outlet } from 'react-router';
import { BrandLogo, UserMenu } from '../../shared/ui';
import { useAuth } from '../../modules/auth/ui/hooks/useAuth';
import HostPropertyProvider from '../../modules/host/ui/providers/HostPropertyProvider';
import { notifyMessages, useNotification } from '../../shared/notifications';

const navItems = [
  { to: '/host', label: 'Tableau de bord', icon: faTableColumns, end: true },
  { to: '/host/reservations', label: 'Réservations', icon: faCalendarCheck },
  { to: '/host/property', label: 'Mes établissements', icon: faHotel },
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
      <div className="flex min-h-screen bg-slate-50 font-sans">
        <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-slate-200 bg-white">
          <div className="flex h-20 items-center border-b border-slate-100 px-8">
            <BrandLogo />
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <p className="mb-6 px-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              Administration
            </p>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                    ].join(' ')
                  }
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="border-t border-slate-100 p-6">
            <Link
              to="/"
              className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Retour au site
            </Link>
          </div>
        </aside>

        <div className="ml-72 flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-20 items-center justify-end border-b border-slate-200 bg-white/80 px-8 backdrop-blur-md">
            <UserMenu
              session={session}
              email={email}
              canAccessHostDashboard={canAccessHostDashboard}
              hasProperty={Boolean(hostAccess?.hasProperty)}
              onLogout={handleLogout}
            />
          </header>
          <main className="mx-auto w-full flex-1 p-8 lg:p-12">
            <Outlet />
          </main>
        </div>
      </div>
    </HostPropertyProvider>
  );
};

export default HostLayout;
