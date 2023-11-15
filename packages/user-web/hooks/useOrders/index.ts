import { useOrdersSubscription } from "hooks/useOrders/queries";

export const useOrders = (userId: string | null) => {
  const { data } = useOrdersSubscription({
    variables: { userId },
    skip: !userId,
  });
  const orders = data?.order ?? [];

  return { orders };
};
