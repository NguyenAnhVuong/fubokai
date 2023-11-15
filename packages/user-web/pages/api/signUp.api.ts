import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { issueToken } from "pages/api/internal/issueToken";
import { isValidRequest } from "pages/api/internal/isValidRequest";
import { prisma } from "pages/api/internal/prisma";
import { SignInOutput, SignUpInput } from "types/graphql";

type Data = SignInOutput | { message: string };

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (!isValidRequest(req, res)) return;

  const { id, name, password, cartName } = req.body.input.input as SignUpInput;

  if (typeof id !== "string" || id === "") return res.status(400).json({ message: "`id` is required" });
  if (typeof name !== "string" || name === "") return res.status(400).json({ message: "`name` is required" });
  if (typeof password !== "string" || password === "")
    return res.status(400).json({ message: "`password` is required" });

  const user = await prisma.user.findFirst({ where: { id } });
  const cart = await prisma.cart.findFirst({ where: { name: cartName } });
  if (user) return res.status(400).json({ message: "This user has already been in use" });
  if (cart) return res.status(400).json({ message: "This cart has already been in use" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const { token, usingCartId } = await prisma.$transaction(async (transaction) => {
      const newUser = await transaction.user.create({ data: { id, name, password: hashedPassword } });
      const newCart = await transaction.cart.create({ data: { name: cartName, creatorId: newUser.id } });
      await transaction.user.update({ where: { id: newUser.id }, data: { usingCartId: newCart.id } });
      return { token: issueToken(id), usingCartId: newCart.id };
    });
    return res.status(200).json({ id, token, usingCartId });
  } catch (e) {
    return res.status(400).json({ message: "Failed to create user" });
  }
};

export default handler;
