import { useAuth } from "hooks/useAuth";
import { useCartItems } from "hooks/useCartItems";
import { useOrders } from "hooks/useOrders";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { Header } from "pages/cart/Header";
import { useCartOrderCartItemsMutation } from "pages/cart/queries";
import { Fab } from "pages/index/Fab";
import { useAddMenuIntoCartMutation, useRemoveMenuFromCartMutation } from "pages/index/queries";
import { useCallback } from "react";
import { OrderList } from "./OrderList";

const History = () => {
  const { userId, usingCartId } = useAuth();
  const { orders } = useOrders(userId);
  const { cartItems } = useCartItems(usingCartId);

  const router = useRouter();
  const [orderCartItems] = useCartOrderCartItemsMutation();

  const onOrderCartItems = useCallback(async () => {
    await orderCartItems();
    await router.back();
  }, [orderCartItems, router]);

  const [addMenuIntoCart] = useAddMenuIntoCartMutation();

  const [removeMenuFromCart] = useRemoveMenuFromCartMutation();

  const onAdd = useCallback(
    (menuId: string) => {
      if (usingCartId) {
        addMenuIntoCart({ variables: { input: { menuId, quantity: 1, cartId: usingCartId } } });
      }
    },
    [addMenuIntoCart, usingCartId],
  );

  const onRemove = useCallback(
    (menuId: string) => {
      if (usingCartId) {
        removeMenuFromCart({ variables: { input: { menuId, quantity: 1, cartId: usingCartId } } });
      }
    },
    [removeMenuFromCart, usingCartId],
  );

  return (
    <>
      <Head>
        <title>MO App</title>
      </Head>
      <Header />
      <OrderList cartItems={cartItems} orders={orders} onAdd={onAdd} onRemove={onRemove} />
      <Fab cartItems={cartItems} />
    </>
  );
};

export default History;
