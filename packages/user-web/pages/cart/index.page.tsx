import { useAuth } from "hooks/useAuth";
import { useCartItems } from "hooks/useCartItems";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { CartItemList } from "pages/cart/CartItemList";
import { Fab } from "pages/cart/Fab";
import { Header } from "pages/cart/Header";
import { useCartOrderCartItemsMutation } from "pages/cart/queries";
import { useCallback } from "react";

const Cart = () => {
  const { usingCartId } = useAuth();
  const { cartItems } = useCartItems(usingCartId);
  const router = useRouter();
  const [orderCartItems] = useCartOrderCartItemsMutation();

  const onOrderCartItems = useCallback(async () => {
    if (!usingCartId) return;
    await orderCartItems({
      variables: {
        input: {
          cartId: usingCartId,
        },
      },
    });
    router.back();
  }, [orderCartItems, router, usingCartId]);

  return (
    <>
      <Head>
        <title>MO App</title>
      </Head>
      <Header />
      <CartItemList cartItems={cartItems} />
      <Fab onOrderCartItems={onOrderCartItems} />
    </>
  );
};

export default Cart;
