import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../../../shared/ui';
import type { HostStripeConnect } from '../../core/types/host.types';
import HostFormError from './HostFormError';

type HostStripeConnectBannerProps = {
  stripe: HostStripeConnect;
  busy: boolean;
  error: string | null;
  onStartOnboarding: () => void;
  onOpenDashboard: () => void;
};

const HostStripeConnectBanner = ({
  stripe,
  busy,
  error,
  onStartOnboarding,
  onOpenDashboard,
}: HostStripeConnectBannerProps) => {
  const paymentsReady = stripe.chargesEnabled || stripe.onboardingStatus === 'complete';

  if (paymentsReady) {
    return (
      <div className="rounded-2xl border border-ink/8 bg-surface p-6 soft-shadow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-ink/40">
              Paiements
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              Versements Stripe activés
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Vos voyageurs paient la plateforme ; le net est transféré sur votre compte.
            </p>
          </div>
          <Button variant="secondary" size="sm" disabled={busy} onClick={onOpenDashboard}>
            {busy ? 'Ouverture…' : 'Ouvrir mon dashboard Stripe'}
          </Button>
        </div>
        {error ? <HostFormError message={error} className="mt-4" /> : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-50 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
            <FontAwesomeIcon icon="triangle-exclamation" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Paiements non activés</h2>
            <p className="mt-1 text-sm text-ink/70">
              Complétez votre dossier Stripe (identité et IBAN) pour recevoir les paiements de
              vos réservations.
            </p>
          </div>
        </div>
        <Button variant="primary" size="sm" disabled={busy} onClick={onStartOnboarding}>
          {busy ? 'Redirection…' : 'Activer les paiements'}
        </Button>
      </div>
      {error ? <HostFormError message={error} className="mt-4" /> : null}
    </div>
  );
};

export default HostStripeConnectBanner;
