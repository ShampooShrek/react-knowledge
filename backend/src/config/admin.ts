import { NextFunction, Request, Response } from "express";
import prisma from "../libs/prisma";

const Admin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.body.userId },
    });
    if (!user)
      return res
        .status(401)
        .json({ type: "error", response: "Usuário não é administrador!" });
    if (user.admin) {
      next();
    } else {
      return res
        .status(401)
        .json({ type: "error", response: "Usuário não é administrador!" });
    }
  } catch (err: any) {
    return res
      .status(500)
      .json({
        type: "error",
        response: "Ops, algo deu errado, tente novamente mais tarde!",
      });
  } finally {
    await prisma.$disconnect();
  }
};

export default Admin;
