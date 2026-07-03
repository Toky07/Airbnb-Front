import { type FormEvent } from 'react';
import { Link } from 'react-router';
import type { CartItem } from '../../core/types/cart.types';
import { formatCartPrice } from '../../core/types/cart.types';
import { Button } from '../../../../shared/ui';
import { parseProductLabel } from '../../../../shared/ui/product/parse-product-label';

type CartOrderSummaryProps = {
  items: CartItem[];
  itemCount: number;
  totalLabel: string;
  error: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  onCheckout: (event: FormEvent) => void;
};

const CartOrderSummary = ({
  items,
  itemCount,
  totalLabel,
  error,
  loading,
  isAuthenticated,
  onCheckout,
}: CartOrderSummaryProps) => (
  <aside className="lg:sticky lg:top-24">
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
      <div className="border-b border-slate-100 bg-slate-900 px-6 py-5 text-white">
        <h2 className="text-lg font-semibold">Récapitulatif</h2>
        <p className="mt-1 text-sm text-slate-300">
          {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
        </p>
      </div>

      <div className="space-y-4 px-6 py-5">
        {items.map((item) => {
          const parsed = parseProductLabel(item.label);
          return (
            <div key={`summary-${item.id}`} className="flex items-start justify-between gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-900">{item.roomName ?? parsed.roomName}</p>
                <p className="text-slate-500">{item.propertyName ?? parsed.propertyName}</p>
              </div>
              <p className="font-semibold text-slate-900">{formatCartPrice(item.totalPrice)}</p>
            </div>
          );
        })}

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">Total</span>
            <span className="text-2xl font-bold text-slate-900">{totalLabel}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Taxes et frais inclus</p>
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
          <p className="text-center text-xs text-slate-500">
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
