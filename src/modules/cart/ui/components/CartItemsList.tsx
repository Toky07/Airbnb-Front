import type { CartItem, UpdateCartItemPayload } from '../../core/types/cart.types';
import { mapCartItemToProductDetails } from '../../core/utils/map-cart-item-details';
import { StayProductCard } from '../../../../shared/ui/product/StayProductCard';
import { parseProductLabel } from '../../../../shared/ui/product/parse-product-label';
import CartReservationEditor from './CartReservationEditor';

type CartItemsListProps = {
  items: CartItem[];
  removingId: number | null;
  updatingId: number | null;
  onRemove: (itemId: number) => void;
  onUpdate: (
    itemId: number,
    payload: UpdateCartItemPayload,
  ) => Promise<{ success: boolean; error?: string }>;
};

const CartItemsList = ({
  items,
  removingId,
  updatingId,
  onRemove,
  onUpdate,
}: CartItemsListProps) => (
  <div className="space-y-5">
    {items.map((item) => {
      const details = mapCartItemToProductDetails(item);
      const fallback = parseProductLabel(item.label);

      return (
        <div key={item.id}>
          <StayProductCard
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
                className="rounded-xl px-4 py-2 text-sm font-semibold text-red-600 transition duration-200 hover:bg-red-50 disabled:opacity-50"
              >
                {removingId === item.id ? 'Suppression…' : 'Retirer'}
              </button>
            }
          />
          {item.itemType === 'reservation' ? (
            <CartReservationEditor
              item={item}
              updating={updatingId === item.id}
              onUpdate={onUpdate}
            />
          ) : null}
        </div>
      );
    })}
  </div>
);

export default CartItemsList;
