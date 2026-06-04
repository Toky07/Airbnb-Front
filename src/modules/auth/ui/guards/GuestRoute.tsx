import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const GuestRoute = () => {
  const { isAuthenticated, isHost } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={isHost ? '/host' : '/'} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
