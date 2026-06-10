import {
  parseProductLabel,
  type StayProductDetails,
} from '../../../../shared/ui/product/StayProductCard';
import { formatCartPrice, type CartItem } from '../../core/types/cart.types';

export function mapCartItemToProductDetails(item: CartItem): StayProductDetails {
  const parsed = parseProductLabel(item.label);

  return {
    roomName: item.roomName ?? parsed.roomName,
    propertyName: item.propertyName ?? parsed.propertyName,
    propertyCity: item.propertyCity,
    imageUrl: item.imageUrl,
    startDate: item.startDate,
    endDate: item.endDate,
    guestCount: item.guestCount,
    nights: item.nights,
    totalPrice: item.totalPrice,
    priceLabel: formatCartPrice(item.totalPrice),
    roomId: item.roomId,
  };
}
