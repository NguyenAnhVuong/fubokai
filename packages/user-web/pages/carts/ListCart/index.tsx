import { Search, ShoppingCart } from "@material-ui/icons";
import { Cart } from "pages/index/types";
import styled from "styled-components";
import { useAddUserCartMutation, useGetUsersQuery, useUseCartMutation } from "../queries";
import { useAuth } from "hooks/useAuth";
import { Backdrop, Button, Fade, Modal, OutlinedInput, TextField } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import { useStyles } from "../Header";
import { Spacer } from "components/Spacer";

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

const CartAction = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;

const SearchBar = styled(OutlinedInput).attrs({
  placeholder: "ユーザーID",
  endAdornment: <Search />,
})`
  width: 100%;
  max-width: 200px;
  max-height: 40px;
  border: 1px solid white;
`;

const UserCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 1px solid #ccc;
  width: 100%;
  margin-bottom: 8px;
  gap: 8px;
`;

const UserInfo = styled.div`
  width: 100%;
`;

const ListCart = ({ carts }: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviteUser] = useAddUserCartMutation();
  const [inviteCartId, setInviteCartId] = useState("");
  const { userId, updateUsingCartId, usingCartId } = useAuth();

  const { data: users } = useGetUsersQuery({
    variables: {
      keyword: `%${inviteUserId}%`,
      notId: userId,
    },
    skip: !inviteUserId,
  });

  const handleOpen = (carId: string) => {
    setInviteCartId(carId);
    setOpen(true);
  };

  const handleClose = () => {
    setInviteUserId("");
    setOpen(false);
  };

  const [usingCart] = useUseCartMutation();
  const router = useRouter();
  const handleUseCart = async (cartId: string) => {
    if (!userId) return;
    try {
      const { data } = await usingCart({
        variables: {
          userId,
          cartId,
        },
      });
      if (data) {
        updateUsingCartId(cartId);
        router.push("/");
      }
    } catch (e) {}
  };

  const handleInviteUser = async (userId: string, cartId: string) => {
    try {
      const { data } = await inviteUser({
        variables: {
          userId,
          cartId,
        },
      });
      if (data) {
        handleClose();
      }
    } catch (e) {}
  };

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
            <CartAction>
              {cart.creatorId === userId && (
                <Button variant="contained" color="primary" onClick={() => handleOpen(cart.id)}>
                  招待
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleUseCart(cart.id)}
                disabled={cart.id === usingCartId}
              >
                使用
              </Button>
            </CartAction>
          </CartCard>
        );
      })}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">カートの追加</h2>
            <SearchBar onChange={(e) => setInviteUserId(e.target.value)} defaultValue={""} />
            <Spacer size={2} />
            {users &&
              users.user.map((user) => (
                <UserCard key={user.id}>
                  <UserInfo>
                    <div>ID: {user.id}</div>
                    <div>名前： {user.name}</div>
                  </UserInfo>
                  <Button variant="contained" color="primary" onClick={() => handleInviteUser(user.id, inviteCartId)}>
                    招待
                  </Button>
                </UserCard>
              ))}
            <Button variant="contained" color="primary" onClick={handleClose}>
              閉じる
            </Button>
          </div>
        </Fade>
      </Modal>
    </ListCartContainer>
  );
};

export default ListCart;
