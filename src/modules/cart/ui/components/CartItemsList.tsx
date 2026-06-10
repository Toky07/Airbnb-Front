import type { CartItem } from '../../core/types/cart.types';
import { mapCartItemToProductDetails } from '../../core/utils/map-cart-item-details';
import {
  StayProductCard,
  parseProductLabel,
} from '../../../../shared/ui/product/StayProductCard';

type CartItemsListProps = {
  items: CartItem[];
  removingId: number | null;
  onRemove: (itemId: number) => void;
};

const CartItemsList = ({ items, removingId, onRemove }: CartItemsListProps) => (
  <div className="space-y-5">
    {items.map((item) => {
      const details = mapCartItemToProductDetails(item);
      const fallback = parseProductLabel(item.label);

      return (
        <StayProductCard
          key={item.id}
          badge={item.itemType === 'reservation' ? 'Séjour' : 'Service'}
          details={{
            ...details,
            roomName: details.roomName || fallback.roomName,
            propertyName: details.propertyName || fallback.propertyName,
          }}
          footerLink={
            item.roomSlug ? { to: `/rooms/${item.roomSlug}`, label: 'Voir la chambre' } : undefined
          }
          action={
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              disabled={removingId === item.id}
              className="rounded-full px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              {removingId === item.id ? 'Suppression…' : 'Retirer'}
            </button>
          }
        />
      );
    })}
  </div>
);

export default CartItemsList;
