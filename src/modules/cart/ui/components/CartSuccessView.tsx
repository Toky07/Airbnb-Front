import { Button, PageContainer } from '../../../../shared/ui';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';

type CartSuccessViewProps = {
  onViewPurchases: () => void;
  onGoHome: () => void;
};

const CartSuccessView = ({ onViewPurchases, onGoHome }: CartSuccessViewProps) => (
  <PublicPageLayout>
    <PageContainer className="page-mist py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-surface p-10 text-center soft-shadow">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-brand/10 text-2xl text-brand">
          ✓
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-ink">Paiement confirmé</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">
          Vos réservations ont été confirmées. Retrouvez-les dans votre espace achats.
        </p>
        <Button type="button" className="mt-8 w-full" onClick={onViewPurchases}>
          Voir mes achats
        </Button>
        <Button type="button" variant="secondary" className="mt-3 w-full" onClick={onGoHome}>
          Retour à l’accueil
        </Button>
      </div>
    </PageContainer>
  </PublicPageLayout>
);

export default CartSuccessView;
