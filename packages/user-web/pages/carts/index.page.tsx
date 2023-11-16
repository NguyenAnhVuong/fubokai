import { useAuth } from "hooks/useAuth";
import Head from "next/head";
import { Header } from "./Header";
import ListCart from "./ListCart";
import { useGetCartsSubscription } from "./queries";

type Props = {};

const Carts = (props: Props) => {
  const { userId } = useAuth();

  const { data: carts } = useGetCartsSubscription({
    variables: {
      userId,
    },
  });

  return (
    <div>
      <Head>
        <title>MO App</title>
      </Head>
      <Header />
      {carts && carts.cart && carts.cart.length > 0 && <ListCart carts={carts.cart} />}
    </div>
  );
};

export default Carts;
