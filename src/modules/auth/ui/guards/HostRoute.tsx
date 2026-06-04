import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const HostRoute = () => {
  const { isAuthenticated, isHost, can } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isHost || !can('host.dashboard.read')) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default HostRoute;
