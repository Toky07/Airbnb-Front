import { type FormEvent } from 'react';
import { Link } from 'react-router';
import type { PricingBreakdown } from '../../../../shared/pricing/pricing-breakdown.types';
import PricingBreakdownSummary from '../../../../shared/ui/pricing/PricingBreakdownSummary';
import type { CartItem } from '../../core/types/cart.types';
import { formatCartPrice } from '../../core/types/cart.types';
import { Button } from '../../../../shared/ui';
import { parseProductLabel } from '../../../../shared/ui/product/parse-product-label';

type CartOrderSummaryProps = {
  items: CartItem[];
  itemCount: number;
  totalLabel: string;
  pricingBreakdown: PricingBreakdown | null;
  error: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  onCheckout: (event: FormEvent) => void;
};

const CartOrderSummary = ({
  items,
  itemCount,
  totalLabel,
  pricingBreakdown,
  error,
  loading,
  isAuthenticated,
  onCheckout,
}: CartOrderSummaryProps) => (
  <aside className="lg:sticky lg:top-24">
    <div className="overflow-hidden rounded-2xl border border-line bg-surface soft-shadow">
      <div className="border-b border-line bg-brand px-6 py-5 text-white">
        <h2 className="font-display text-lg font-bold">Récapitulatif</h2>
        <p className="mt-1 text-sm text-white/80">
          {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
        </p>
      </div>

      <div className="space-y-4 px-6 py-5">
        {items.map((item) => {
          const parsed = parseProductLabel(item.label);
          return (
            <div key={`summary-${item.id}`} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-medium text-ink">{item.roomName ?? parsed.roomName}</p>
                <p className="text-ink/50">{item.propertyName ?? parsed.propertyName}</p>
              </div>
              <p className="font-semibold text-ink">{formatCartPrice(item.totalPrice)}</p>
            </div>
          );
        })}

        <div className="border-t border-line pt-4">
          {pricingBreakdown ? (
            <PricingBreakdownSummary breakdown={pricingBreakdown} />
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink/60">Total</span>
              <span className="font-display text-2xl font-bold text-ink">{totalLabel}</span>
            </div>
          )}
        </div>

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <form onSubmit={onCheckout}>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? 'Préparation…'
              : isAuthenticated
                ? 'Procéder au paiement'
                : 'Se connecter pour payer'}
          </Button>
        </form>

        {!isAuthenticated ? (
          <p className="text-center text-xs text-ink/50">
            Pas encore de compte ?{' '}
            <Link
              to="/register?redirect=%2Fcart"
              className="font-semibold text-brand hover:text-brand-dark"
            >
              Créer un compte
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  </aside>
);

export default CartOrderSummary;
