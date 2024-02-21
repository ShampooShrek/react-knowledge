import { Request, Response } from "express";
import bcrypt from "bcryptjs"
import { existsOrError } from "../../validation";
import prisma from "../../libs/prisma";
import { sign } from "jsonwebtoken";

const createToken = (userId: number, admin: boolean) => {
  const token = sign({ userId, admin }, `${process.env.JWT_KEY}`, {
    subject: userId.toString(),
    expiresIn: "7d"
  })
  return token
}


const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    if (!existsOrError(email)) return res.status(400).json({ type: "error", response: "Preencha o formulário corretamente!" })
    if (!existsOrError(password)) return res.status(400).json({ type: "error", response: "Preencha o formulario corretamente!" })

    const userExists = await prisma.user.findUnique({ where: { email } })
    if (!userExists) return res.status(400).json({ type: "error", response: "E-mail e/ou senha incorretos!" })

    const isMath = await bcrypt.compare(password, userExists.password)
    if (!isMath) return res.status(400).json({ type: "error", response: "E-mail e/ou senha incorretos!" })

    const token = createToken(userExists.id, userExists.admin)

    return res.status(200).json({ type: "success", response: { ...userExists, token } })

  } catch (err: any) {
    return res.status(500).json({ type: "error", response: "Ops, algo deu errado, tente novamente mais tarde!" })
  } finally {
    await prisma.$disconnect()
  }
}

const getUserByToken = async (req: Request, res: Response) => {
  const userId = req.body.userId
  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } })
    if (!userExists) return res.status(401).json({ type: "error", response: "Token inválido!" })

    return res.status(200).json({ type: "success", response: userExists })

  } catch (err: any) {
    return res.status(500).json({ type: "error", response: "Ops, algo deu errado, tente novamente mais tarde!" })
  } finally {
    await prisma.$disconnect()
  }
}


export { signIn, getUserByToken }



