import { faBed, faCalendarCheck, faHotel, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, NavLink, Outlet } from 'react-router';
import { BrandLogo, PageContainer, UserMenu } from '../../shared/ui';
import { useAuth } from '../../modules/auth/ui/hooks/useAuth';
import { notifyMessages, useNotification } from '../../shared/notifications';

const navItems = [
  { to: '/host', label: 'Tableau de bord', icon: faTableColumns, end: true },
  { to: '/host/reservations', label: 'Réservations', icon: faCalendarCheck },
  { to: '/host/property', label: 'Mon établissement', icon: faHotel },
  { to: '/host/rooms', label: 'Mes chambres', icon: faBed },
];

const HostLayout = () => {
  const { session, email, canAccessHostDashboard, hostAccess, logout } = useAuth();
  const { success: notifySuccess } = useNotification();

  const handleLogout = () => {
    logout();
    notifySuccess(notifyMessages.auth.logout());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <PageContainer className="flex h-16 items-center justify-between gap-4">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
            >
              Voir les logements
            </Link>
            <UserMenu
              session={session}
              email={email}
              canAccessHostDashboard={canAccessHostDashboard}
              hasProperty={Boolean(hostAccess?.hasProperty)}
              onLogout={handleLogout}
            />
          </div>
        </PageContainer>
      </header>

      <PageContainer className="grid gap-8 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Administration hôtel
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition',
                    isActive
                      ? 'bg-brand text-white shadow-sm shadow-rose-500/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  ].join(' ')
                }
              >
                <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </PageContainer>
    </div>
  );
};

export default HostLayout;
