import { sampleCartApi } from './cart-api.fixtures';

export const emptyCartApi = {
  ...sampleCartApi,
  items: [],
  totalPrice: 0,
  itemCount: 0,
};
