import { Spinner } from '../../../../shared/ui';

const AuthRouteGuardFallback = () => (
  <div
    className="page-mist flex min-h-screen items-center justify-center"
    role="status"
    aria-live="polite"
    aria-label="Chargement…"
  >
    <Spinner className="h-8 w-8 text-brand" />
  </div>
);

export default AuthRouteGuardFallback;
