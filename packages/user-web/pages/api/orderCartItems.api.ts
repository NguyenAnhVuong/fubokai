import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { isValidRequest } from "pages/api/internal/isValidRequest";
import { prisma } from "pages/api/internal/prisma";
import { OrderCartItemsInput, OrderCartItemsOutput, RemoveMenuFromCartInput } from "types/graphql";
import { groupBy } from "util/groupBy";
import { sumBy } from "util/sumBy";

type Data = OrderCartItemsOutput | { message: string };

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (!isValidRequest(req, res)) return;

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(400).json({ message: "Authorization header doesn't exist" });

  const tokenResult = jwt.decode(token);
  if (tokenResult === null || typeof tokenResult === "string")
    return res.status(400).json({ message: "Invalid token" });

  const { cartId } = req.body.input.input as OrderCartItemsInput;

  const { id: userId } = tokenResult;

  const cartItems = await prisma.cartItem.findMany({ where: { cartId }, include: { menu: true } });

  if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

  const totalPrice = cartItems.reduce((acc, { menu, quantity }) => acc + menu.price * quantity, 0);

  try {
    await prisma.$transaction(async (transaction) => {
      const newOrder = await transaction.order.create({
        data: {
          orderedUserId: userId,
          totalPrice,
        },
      });
      await transaction.orderItem.createMany({
        data: cartItems.map(({ menu, quantity }) => ({
          orderId: newOrder.id,
          menuId: menu.id,
          quantity,
        })),
      });
      await transaction.cartItem.deleteMany({ where: { cartId } });
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to remove menu from cart" });
  }
};

export default handler;
