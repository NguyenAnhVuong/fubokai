import Head from "next/head";
import { Header } from "./Header";
import { useGetCartsQuery } from "./queries";
import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/dist/client/router";
import ListCart from "./ListCart";

type Props = {};

const Carts = (props: Props) => {
  const { userId } = useAuth();
  const router = useRouter();

  const { data: carts } = useGetCartsQuery({
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
