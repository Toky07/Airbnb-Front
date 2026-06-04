import { Navigate, Outlet } from 'react-router';
import { resolvePostLoginRedirect } from '../../core/services/resolve-post-login-redirect';
import { useAuth } from '../hooks/useAuth';

const GuestRoute = () => {
  const { isAuthenticated, isLoading, session } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={resolvePostLoginRedirect(session)} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
