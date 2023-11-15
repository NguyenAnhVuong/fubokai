import { Spacer } from "components/Spacer";
import { Order } from "hooks/useOrders/types";
import Image from "next/image";
import styled from "styled-components";
import { formatPrice } from "util/formatPrice";

import { Button, TextField, Typography } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import dayjs from "dayjs";
import { useAuth } from "hooks/useAuth";
import { CartItem } from "hooks/useCartItems/types";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: ${({ theme }) => theme.spacing(8)}px;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacing(1)}px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  padding: ${({ theme }) => theme.spacing(1)}px;
`;

const StyledImage = styled(Image)`
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`;

const Name = styled(Typography).attrs({ variant: "body2" })`
  font-weight: bold;
  flex: 1;
`;

const Quantity = styled(Typography).attrs({ variant: "body2" })`
  font-weight: bold;
  flex: 1;
  text-align: center;
`;

const Description = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Orderer = styled(Typography).attrs({ variant: "body2" })`
  font-weight: bold;
  flex: 1;
`;

const ColContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`;

const ReOrder = styled(Button).attrs({ variant: "contained" })`
  font-weight: bold;
  flex: 1;
  max-height: 28px;
  padding: ${({ theme }) => theme.spacing(0.4)}px;
  background-color: ${({ theme }) => theme.palette.secondary.main};
`;

const ProductNumberContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
  justify-content: center;
`;

const ProductNumber = styled(TextField).attrs({ id: "standard-number", placeholder: "再注文", type: "number" })`
  max-width: 40px;
  & input {
    text-align: center;
    font-size: 0.8rem;
  }
`;

const Price = styled(Typography).attrs({ variant: "caption" })`
  font-weight: bold;
  font-size: 0.8rem;
  flex: 1;
  text-align: center;
`;

const OrderDate = styled(Typography).attrs({ variant: "caption" })`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing(1)}px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: ${({ theme }) => theme.spacing(1)}px;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  padding: ${({ theme }) => theme.spacing(1)}px;
`;

const TotalPrice = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: ${({ theme }) => theme.spacing(1)}px;
`;

type Props = {
  cartItems: CartItem[];
  orders: Order[];
  onAdd: (menuId: string) => void;
  onRemove: (menuId: string) => void;
};

export const OrderList = ({ cartItems, orders, onAdd, onRemove }: Props) => {
  const userId = useAuth().userId;
  const cartCountMap = cartItems.reduce((acc, { menuId, quantity, user }) => {
    if (user.id !== userId) return acc;
    acc[menuId] = (acc[menuId] ?? 0) + quantity;
    return acc;
  }, {} as Record<string, number>);

  const sortedOrders = orders.sort((a, b) => {
    if (a.orderedAt > b.orderedAt) return -1;
    if (a.orderedAt < b.orderedAt) return 1;
    return 0;
  });

  return (
    <Container>
      {sortedOrders.map(({ id, orderedAt, orderItems, totalPrice }) => (
        <Card key={id}>
          <OrderDate>{dayjs(orderedAt).format("YYYY年MM月DD日 HH:mm")}</OrderDate>
          {orderItems.length > 0 &&
            orderItems.map(({ id, menu, quantity }) => (
              <OrderItem key={id}>
                <StyledImage key={menu.image} src={`/images/${menu.image}`} width={64} height={64} alt={menu.name} />
                <Spacer size={1} />
                <Description>
                  <ColContainer>
                    <Name>{menu.name}</Name>
                    {/* <Orderer>{user.name}</Orderer> */}
                  </ColContainer>
                  <Quantity>x{quantity}</Quantity>
                  <Spacer size={1} />
                  <ColContainer>
                    <Price>{formatPrice(menu.price * quantity)}</Price>
                    <ProductNumberContainer>
                      <Remove onClick={() => onRemove(menu.id)} />
                      <ProductNumber
                        value={cartCountMap[menu.id] ?? 0}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <Add onClick={() => onAdd(menu.id)} />
                    </ProductNumberContainer>
                  </ColContainer>
                </Description>
              </OrderItem>
            ))}
          <TotalPrice>合計金額: {totalPrice}</TotalPrice>
        </Card>
      ))}
    </Container>
  );
};
