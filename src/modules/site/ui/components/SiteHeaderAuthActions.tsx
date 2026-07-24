import { Link } from 'react-router';
import { useNotification } from '../../../../shared/notifications';
import { UserMenu } from '../../../../shared/ui';
import { useAuth } from '../../../auth/ui/hooks/useAuth';

const SiteHeaderAuthActions = () => {
  const {
    isAuthenticated,
    isLoading,
    canAccessHostDashboard,
    session,
    email,
    hostAccess,
    logout,
  } = useAuth();
  const { success: notifySuccess } = useNotification();

  if (isLoading) {
    return (
      <div className="h-9 w-28 animate-pulse rounded-xl bg-mist" aria-hidden />
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Link
          to="/login"
          className="rounded-xl px-4 py-2 text-sm font-medium text-ink/70 transition duration-200 hover:bg-mist hover:text-ink"
        >
          Connexion
        </Link>
        <Link
          to="/register"
          className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-brand-dark"
        >
          Devenir hôte
        </Link>
      </>
    );
  }

  const handleLogout = () => {
    logout();
    notifySuccess('Vous êtes déconnecté.');
  };

  return (
    <UserMenu
      session={session}
      email={email}
      canAccessHostDashboard={canAccessHostDashboard}
      hasProperty={Boolean(hostAccess?.hasProperty)}
      onLogout={handleLogout}
    />
  );
};

export default SiteHeaderAuthActions;
