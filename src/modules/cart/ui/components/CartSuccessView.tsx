import { Button, PageContainer } from '../../../../shared/ui';
import PublicPageLayout from '../../../site/ui/components/PublicPageLayout';

type CartSuccessViewProps = {
  onViewPurchases: () => void;
  onGoHome: () => void;
};

const CartSuccessView = ({ onViewPurchases, onGoHome }: CartSuccessViewProps) => (
  <PublicPageLayout>
    <PageContainer className="py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-10 text-center shadow-lg shadow-emerald-100/50">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          ✓
        </div>
        <h1 className="mt-6 text-2xl font-bold text-emerald-900">Paiement confirmé</h1>
        <p className="mt-3 text-sm leading-6 text-emerald-800">
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
