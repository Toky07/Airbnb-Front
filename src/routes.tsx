import { createBrowserRouter, Outlet } from 'react-router';
import AuthProvider from './modules/auth/ui/providers/AuthProvider';
import GuestRoute from './modules/auth/ui/guards/GuestRoute';
import HostRoute from './modules/auth/ui/guards/HostRoute';
import LoginPage from './modules/auth/ui/pages/LoginPage';
import RegisterPage from './modules/auth/ui/pages/RegisterPage';
import SetPasswordPage from './modules/auth/ui/pages/SetPasswordPage';
import ProtectedRoute from './modules/auth/ui/guards/ProtectedRoute';
import ProfilePage from './modules/account/ui/pages/ProfilePage';
import HostLayout from './layout/host/HostLayout';
import HostDashboardPage from './modules/host/ui/pages/HostDashboardPage';
import HostPropertyPage from './modules/host/ui/pages/HostPropertyPage';
import HostRoomsPage from './modules/host/ui/pages/HostRoomsPage';
import HomePage from './modules/rooms/ui/pages/HomePage';
import SearchPage from './modules/rooms/ui/pages/SearchPage';
import RoomDetailPage from './modules/rooms/ui/pages/RoomDetailPage';
import PublicPageLayout from './modules/site/ui/components/PublicPageLayout';

const LoginRoute = () => (
  <PublicPageLayout>
    <LoginPage />
  </PublicPageLayout>
);

const RegisterRoute = () => (
  <PublicPageLayout>
    <RegisterPage />
  </PublicPageLayout>
);

const SetPasswordRoute = () => (
  <PublicPageLayout>
    <SetPasswordPage />
  </PublicPageLayout>
);

const ProfileRoute = () => (
  <PublicPageLayout>
    <ProfilePage />
  </PublicPageLayout>
);

const AuthShell = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

const router = createBrowserRouter([
  {
    Component: AuthShell,
    children: [
      {
        path: '/',
        Component: HomePage,
      },
      {
        path: '/search',
        Component: SearchPage,
      },
      {
        path: '/rooms/:id',
        Component: RoomDetailPage,
      },
      {
        Component: GuestRoute,
        children: [
          {
            path: '/login',
            Component: LoginRoute,
          },
          {
            path: '/register',
            Component: RegisterRoute,
          },
          {
            path: '/set-password',
            Component: SetPasswordRoute,
          },
        ],
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: '/account/profile',
            Component: ProfileRoute,
          },
        ],
      },
      {
        Component: HostRoute,
        children: [
          {
            path: '/host',
            Component: HostLayout,
            children: [
              {
                index: true,
                Component: HostDashboardPage,
              },
              {
                path: 'property',
                Component: HostPropertyPage,
              },
              {
                path: 'rooms',
                Component: HostRoomsPage,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
