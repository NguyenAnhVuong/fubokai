import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { isValidRequest } from "pages/api/internal/isValidRequest";
import { prisma } from "pages/api/internal/prisma";
import { CreateCartInput, CreateCartOutput } from "types/graphql";

type Data = CreateCartOutput | { message: string };

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (!isValidRequest(req, res)) return;

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(400).json({ message: "Authorization header doesn't exist" });

  const tokenResult = jwt.decode(token);
  if (tokenResult === null || typeof tokenResult === "string")
    return res.status(400).json({ message: "Invalid token" });

  const { id: addedUserId } = tokenResult;
  const { name } = req.body.input.input as CreateCartInput;

  const cart = await prisma.cart.findUnique({ where: { name } });
  if (cart) return res.status(400).json({ message: "Cart existed" });

  try {
    await prisma.$transaction(async (transaction) => {
      const newCart = await transaction.cart.create({
        data: {
          name,
          creatorId: addedUserId,
        },
      });
      await transaction.userCart.create({ data: { userId: addedUserId, cartId: newCart.id } });
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to create cart" });
  }
};

export default handler;
