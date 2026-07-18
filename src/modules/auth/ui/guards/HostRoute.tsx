import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import AuthRouteGuardFallback from './AuthRouteGuardFallback';

const HostRoute = () => {
  const { isAuthenticated, isLoading, canAccessHostDashboard } = useAuth();

  if (isLoading) {
    return <AuthRouteGuardFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessHostDashboard) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default HostRoute;
