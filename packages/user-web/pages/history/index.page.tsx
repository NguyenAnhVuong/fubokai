import { useOrders } from "hooks/useOrders";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { Header } from "pages/cart/Header";
import { useCartOrderCartItemsMutation } from "pages/cart/queries";
import React, { useCallback } from "react";
import { OrderList } from "./OrderList";
import { useCartItems } from "hooks/useCartItems";
import { useIndexAddMenuIntoCartMutation, useIndexRemoveMenuFromCartMutation } from "pages/index/queries";
import { Fab } from "pages/index/Fab";

const History = () => {
  const { orders } = useOrders();
  const { cartItems } = useCartItems();

  const router = useRouter();
  const [orderCartItems] = useCartOrderCartItemsMutation();

  const onOrderCartItems = useCallback(async () => {
    await orderCartItems();
    await router.back();
  }, [orderCartItems, router]);

  const [addMenuIntoCart] = useIndexAddMenuIntoCartMutation();

  const [removeMenuFromCart] = useIndexRemoveMenuFromCartMutation();

  const onAdd = useCallback((menuId: string) => addMenuIntoCart({ variables: { input: { menuId, quantity: 1 } } }), [addMenuIntoCart]);

  const onRemove = useCallback((menuId: string) => removeMenuFromCart({ variables: { input: { menuId, quantity: 1 } } }), [removeMenuFromCart]);

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
