import { ShoppingCart } from "@material-ui/icons";
import { Cart } from "pages/index/types";
import React from "react";
import styled from "styled-components";

type Props = {
  carts: Cart[];
};

const ListCartContainer = styled.div`
  display: flex;
  padding: 8px;
  flex-direction: column;
  gap: 8px;
`;

const CartCard = styled.div`
  display: flex;
  padding: 8px;
  border: 1px solid #ccc;
  width: 100%;
  align-items: center;
  gap: 8px;
`;

const ListCart = ({ carts }: Props) => {
  return (
    <ListCartContainer>
      {carts.map((cart) => {
        return (
          <CartCard key={cart.id}>
            <div>
              <ShoppingCart fontSize="large" />
            </div>
            <div>
              <strong>{cart.name}</strong>
              <div>所有者: {cart.creatorId}</div>
            </div>
          </CartCard>
        );
      })}
    </ListCartContainer>
  );
};

export default ListCart;
