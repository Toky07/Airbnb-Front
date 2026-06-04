import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const HostRoute = () => {
  const { isAuthenticated, isLoading, canAccessHostDashboard } = useAuth();

  if (isLoading) {
    return null;
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
