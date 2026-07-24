import { createBrowserRouter, Outlet } from 'react-router';
import AuthProvider from './modules/auth/ui/providers/AuthProvider';
import CartProvider from './modules/cart/ui/providers/CartProvider';
import GuestRoute from './modules/auth/ui/guards/GuestRoute';
import HostRoute from './modules/auth/ui/guards/HostRoute';
import ProtectedRoute from './modules/auth/ui/guards/ProtectedRoute';
import HostLayout from './layout/host/HostLayout';
import HomePage from './modules/rooms/ui/pages/HomePage';
import PublicPageLayout from './modules/site/ui/components/PublicPageLayout';
import { lazyRoute } from './shared/routing/lazy-route';

const SearchPage = lazyRoute(() => import('./modules/rooms/ui/pages/SearchPage'));
const RoomDetailPage = lazyRoute(() => import('./modules/rooms/ui/pages/RoomDetailPage'));
const CartPage = lazyRoute(() => import('./modules/cart/ui/pages/CartPage'));
const LoginPage = lazyRoute(() => import('./modules/auth/ui/pages/LoginPage'));
const RegisterPage = lazyRoute(() => import('./modules/auth/ui/pages/RegisterPage'));
const SetPasswordPage = lazyRoute(() => import('./modules/auth/ui/pages/SetPasswordPage'));
const ForgotPasswordPage = lazyRoute(() => import('./modules/auth/ui/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazyRoute(() => import('./modules/auth/ui/pages/ResetPasswordPage'));
const ProfilePage = lazyRoute(() => import('./modules/account/ui/pages/ProfilePage'));
const MyPurchasesPage = lazyRoute(() => import('./modules/account/ui/pages/MyPurchasesPage'));
const MessagesPage = lazyRoute(() => import('./modules/messaging/ui/pages/MessagesPage'));
const HostMessagesPage = lazyRoute(
  () => import('./modules/messaging/ui/pages/HostMessagesPage'),
);
const FavoritesPage = lazyRoute(() => import('./modules/favorite/ui/pages/FavoritesPage'));
const HostDashboardPage = lazyRoute(() => import('./modules/host/ui/pages/HostDashboardPage'));
const HostPropertiesListPage = lazyRoute(
  () => import('./modules/host/ui/pages/HostPropertiesListPage'),
);
const HostPropertyCreatePage = lazyRoute(
  () => import('./modules/host/ui/pages/HostPropertyCreatePage'),
);
const HostPropertyDetailPage = lazyRoute(
  () => import('./modules/host/ui/pages/HostPropertyDetailPage'),
);
const HostReservationsPage = lazyRoute(
  () => import('./modules/host/ui/pages/HostReservationsPage'),
);
const NotFoundPage = lazyRoute(() => import('./modules/site/ui/pages/NotFoundPage'));

const withPublicLayout = (Page: ReturnType<typeof lazyRoute>) => () => (
  <PublicPageLayout>
    <Page />
  </PublicPageLayout>
);

const LoginRoute = withPublicLayout(LoginPage);
const RegisterRoute = withPublicLayout(RegisterPage);
const SetPasswordRoute = withPublicLayout(SetPasswordPage);
const ForgotPasswordRoute = withPublicLayout(ForgotPasswordPage);
const ResetPasswordRoute = withPublicLayout(ResetPasswordPage);
const ProfileRoute = withPublicLayout(ProfilePage);
const MyPurchasesRoute = withPublicLayout(MyPurchasesPage);
const MessagesRoute = withPublicLayout(MessagesPage);
const FavoritesRoute = withPublicLayout(FavoritesPage);

const AuthShell = () => (
  <AuthProvider>
    <CartProvider>
      <Outlet />
    </CartProvider>
  </AuthProvider>
);

const router = createBrowserRouter([
  {
    Component: AuthShell,
    children: [
      { path: '/', Component: HomePage },
      { path: '/search', Component: SearchPage },
      { path: '/rooms/:slug', Component: RoomDetailPage },
      { path: '/cart', Component: CartPage },
      {
        Component: GuestRoute,
        children: [
          { path: '/login', Component: LoginRoute },
          { path: '/register', Component: RegisterRoute },
          { path: '/set-password', Component: SetPasswordRoute },
          { path: '/forgot-password', Component: ForgotPasswordRoute },
          { path: '/reset-password', Component: ResetPasswordRoute },
        ],
      },
      {
        Component: ProtectedRoute,
        children: [
          { path: '/account/profile', Component: ProfileRoute },
          { path: '/account/purchases', Component: MyPurchasesRoute },
          { path: '/account/messages', Component: MessagesRoute },
          { path: '/account/messages/:conversationId', Component: MessagesRoute },
          { path: '/account/favorites', Component: FavoritesRoute },
        ],
      },
      {
        Component: HostRoute,
        children: [
          {
            path: '/host',
            Component: HostLayout,
            children: [
              { index: true, Component: HostDashboardPage },
              { path: 'reservations', Component: HostReservationsPage },
              { path: 'messages', Component: HostMessagesPage },
              { path: 'messages/:conversationId', Component: HostMessagesPage },
              { path: 'property', Component: HostPropertiesListPage },
              { path: 'property/new', Component: HostPropertyCreatePage },
              { path: 'property/:id', Component: HostPropertyDetailPage },
            ],
          },
        ],
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);

export default router;
