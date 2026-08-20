import { Navigate, Outlet, useLocation } from 'react-router';
import { buildAuthRouteWithRedirect } from '../../core/services/resolve-post-login-redirect';
import { useAuth } from '../hooks/useAuth';
import AuthRouteGuardFallback from './AuthRouteGuardFallback';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <AuthRouteGuardFallback />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={buildAuthRouteWithRedirect('/login', location.pathname)}
        replace
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
