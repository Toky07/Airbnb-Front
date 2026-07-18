import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import AuthRouteGuardFallback from './AuthRouteGuardFallback';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthRouteGuardFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
