import { Navigate, Outlet, useSearchParams } from 'react-router';
import { resolvePostLoginRedirect } from '../../core/services/resolve-post-login-redirect';
import { useAuth } from '../hooks/useAuth';

const GuestRoute = () => {
  const { isAuthenticated, isLoading, session } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={resolvePostLoginRedirect(session, redirect)} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
