import { Backdrop, Button, Fade, Modal, TextField, makeStyles } from "@material-ui/core";
import { AddShoppingCart, ArrowBack } from "@material-ui/icons";
import { Spacer } from "components/Spacer";
import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";
import styled from "styled-components";
import { GetCarts, useAddCartMutation, useAddUserCartMutation } from "../queries";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.palette.common.white};
  background: ${({ theme }) => theme.palette.primary.main};
  padding: ${({ theme }) => theme.spacing(2)}px ${({ theme }) => theme.spacing(1)}px;
  position: relative;
`;

const CartButton = styled(Button).attrs({
  startIcon: <AddShoppingCart />,
  color: "inherit",
})``;

export const Header = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();

  const [cartName, setCartName] = useState("");

  const [addCart] = useAddCartMutation();
  const [addUserCart] = useAddUserCartMutation();

  const { userId } = useAuth();

  const handleAddCart = async () => {
    try {
      const { data: addCartData } = await addCart({ variables: { name: cartName, creatorId: userId } });
      if (addCartData?.insert_cart_one?.id) {
        const { data: addUserCartData } = await addUserCart({
          variables: { userId: userId, cartId: addCartData.insert_cart_one.id },
          refetchQueries: [
            {
              query: GetCarts,
              variables: {
                userId,
              },
            },
          ],
        });
        if (addUserCartData) {
          setOpen(false);
          setCartName("");
        }
      }
    } catch (e) {}
  };

  return (
    <Container>
      <Button color="inherit" startIcon={<ArrowBack />} onClick={() => router.back()}>
        戻る
      </Button>
      <CartButton onClick={handleOpen}>カートの追加</CartButton>

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
            <TextField label="カート名" variant="outlined" margin="dense" fullWidth onChange={(e) => setCartName(e.target.value)} />
            <Spacer size={2} />
            <Button variant="contained" color="primary" onClick={handleAddCart}>
              追加
            </Button>
          </div>
        </Fade>
      </Modal>
    </Container>
  );
};
