import { Request, Response } from "express";
import prisma from "../../libs/prisma";




export const getStatus = async (req: Request, res: Response) => {
  try {
    const qtdUsersPromise = prisma.user.count()
    const qtdCategoriesPromise = prisma.categories.count()
    const qtdArticlesPromise = prisma.articles.count()

    const [users, categories, articles] = await Promise.all([qtdUsersPromise, qtdCategoriesPromise, qtdArticlesPromise])

    return res.status(200).json({ type: "success", response: { users, categories, articles } })
  } catch (err: any) {
    return res.status(500).json({ type: "error", response: "ops, algo deu errado, tente novamente mais tatrde" })
  } finally {
    await prisma.$disconnect()
  }
}
