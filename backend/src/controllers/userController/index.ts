import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { existsOrError } from "../../validation";

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { name: true, id: true, email: true },
    });

    return res.status(200).json({ type: "success", response: users });
  } catch (err: any) {
    return res.status(500).json({
      type: "error",
      response: "Ops, algo deu errado, tente novamente mais tarde!",
    });
  } finally {
    await prisma.$disconnect();
  }
};

interface PostUserRequest extends User {
  confPassword?: string;
}

const getUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findFirst({
      where: { id },
      include: { articles: true },
    });
    if (!user)
      return res
        .status(400)
        .json({ type: "error", response: "Usuário não encontrado" });

    return res.status(200).json({ type: "success", response: user });
  } catch (err: any) {
    return res.status(500).json({
      type: "error",
      response: "Ops, algo deu errado, tente novamente mais tarde!",
    });
  } finally {
    await prisma.$disconnect();
  }
};

const postUser = async (req: Request, res: Response) => {
  const { name, email, password, confPassword }: PostUserRequest = req.body;
  console.log(name, email, password, confPassword);
  let admin;

  if (req.originalUrl.startsWith("/admin")) admin = true;
  else admin = false;

  const encryptPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  try {
    if (!existsOrError(name))
      return res
        .status(400)
        .json({ type: "error", response: "Nome de usuário inválido!" });
    if (!existsOrError(email))
      return res
        .status(400)
        .json({ type: "error", response: "Email de usuário inválido!" });
    if (!existsOrError(password))
      return res
        .status(400)
        .json({ type: "error", response: "Senha de usuário inválido!" });

    if (!confPassword || !existsOrError(confPassword))
      return res
        .status(400)
        .json({ type: "error", response: "Confirme sua senha!" });

    if (password !== confPassword)
      return res
        .status(400)
        .json({ type: "error", response: "Senhas não conferem!" });

    const userNameExists = await prisma.user.findUnique({ where: { name } });
    const userEmailExists = await prisma.user.findUnique({ where: { email } });

    if (userNameExists)
      return res
        .status(400)
        .json({ type: "error", response: "Nome de usuário em uso!" });
    if (userEmailExists)
      return res
        .status(400)
        .json({ type: "error", response: "Email de usuário em uso!" });

    const encryptedPassword = encryptPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: encryptedPassword, admin },
    });

    return res.status(200).json({ type: "success", response: user });
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({
      type: "error",
      response: "Ops, algo deu errado, tente novamente mais tarde!",
    });
  } finally {
    await prisma.$disconnect();
  }
};

const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email }: PostUserRequest = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { id } });

    if (!userExists)
      return res
        .status(400)
        .json({ type: "error", response: "Usuário não encontrado!" });

    const userNameExists = await prisma.user.findUnique({ where: { name } });
    const userEmailExists = await prisma.user.findUnique({ where: { email } });

    if (userNameExists && userNameExists.id !== id)
      return res
        .status(400)
        .json({ type: "error", response: "Nome de usuário em uso!" });
    if (userEmailExists && userEmailExists.id !== id)
      return res
        .status(400)
        .json({ type: "error", response: "Email de usuário em uso!" });

    if (!existsOrError(name))
      return res
        .status(400)
        .json({ type: "error", response: "Nome de usuário inválido!" });
    if (!existsOrError(email))
      return res
        .status(400)
        .json({ type: "error", response: "Email de usuário inválido!" });

    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
      include: { articles: true },
    });
    return res.status(200).json({ type: "success", response: user });
  } catch (err: any) {
    return res.status(500).json({ type: "Error" });
  } finally {
    await prisma.$disconnect();
  }
};

const removeUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists)
      return res
        .status(400)
        .json({ type: "error", response: "Usuário não encontrado" });

    await prisma.user.update({ where: { id }, data: { deleted: true } });

    return res
      .status(200)
      .json({ type: "success", response: "Usuário deletado com sucesso!" });
  } catch (err: any) {
    return res.status(500).json({
      type: "error",
      response: "Ops, algo deu errado, tente novamente mais tarde!",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export { getUsers, postUser, updateUser, removeUser, getUser };
