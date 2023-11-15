import { useCartItemsSubscription } from "hooks/useCartItems/queries";

export const useCartItems = (cartId: string | null) => {
  const { data } = useCartItemsSubscription({ variables: { cartId }, skip: !cartId });
  const cartItems = data?.cartItem ?? [];

  return { cartItems };
};
