import { Articles } from "@prisma/client";
import { Request, Response } from "express";
import { existsOrError } from "../../validation";
import prisma from "../../libs/prisma";

const getArticles = async (req: Request, res: Response) => {
  const limit = 1;
  const page = Number(req.query.page) || 1;
  try {
    const articlesQuery = await prisma.articles.findMany({
      take: limit,
      skip: page * limit - limit,
      include: {
        user: { select: { name: true, email: true, id: true } },
        category: true,
      },
    });

    const articleCount = await prisma.articles.count();

    const articles = articlesQuery.map((article) => ({
      ...article,
      content: article.content.toString(),
    }));

    return res.status(200).json({
      type: "success",
      response: { data: articles, count: articleCount, limit },
    });
  } catch (err: any) {
    return res.status(500).json({
      type: "error",
      response: "Ops, algo deu errado, tente novamente mais tarde!",
    });
  } finally {
    await prisma.$disconnect();
  }
};

const getArticle = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const article = await prisma.articles.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!article)
      return res
        .status(400)
        .json({ type: "error", response: "Artigo não encontrado!" });

    return res.status(200).json({
      type: "success",
      response: { ...article, content: article.content.toString() },
    });
  } catch (err: any) {
    return res.status(500).json({
      type: "error",
      response: "Ops, algo deu errado, tente novamente mais tarde!",
    });
  } finally {
    await prisma.$disconnect();
  }
};

const getArticleByCategory = async (req: Request, res: Response) => {
  const limit = 1;
  const categoryId = Number(req.params.categoryId);
  const page = Number(req.query.page) || 1;

  try {
    const categoryExists = await prisma.categories.findUnique({
      where: { id: categoryId },
      include: { Categories: true },
    });
    if (!categoryExists)
      return res
        .status(400)
        .json({ type: "error", response: "Categoria não encontrada!" });

    const subcategories: { id: number }[] = await prisma.$queryRaw`
      WITH RECURSIVE subcategories (id) as (
        select id from "Categories" where id = ${categoryId}
        UNION ALL
          select c.id from subcategories s join "Categories" c on c."parentId" = s.id
      )
      select id from subcategories
    `;

    const ids = subcategories.map((c) => c.id);

    const articles = await prisma.articles.findMany({
      where: { categoryId: { in: ids } },
      take: limit,
      skip: page * limit - limit,
      select: {
        name: true,
        id: true,
        description: true,
        imageUrl: true,
        user: { select: { name: true, email: true, id: true } },
      },
      orderBy: { id: "desc" },
    });

    return res.status(200).json({
      type: "success",
      response: articles,
    });
  } catch (err: any) {
    return res.status(400).json({
      type: "error",
      response: "Ops, algo deu errado, tente novamente mais tarde!",
    });
  } finally {
    await prisma.$disconnect();
  }
};

const postArticle = async (req: Request, res: Response) => {
  const {
    name,
    description,
    imageUrl,
    content,
    categoryId,
    userId: id,
  }: Articles = req.body;
  const contentBuffer = Buffer.from(content);

  try {
    if (!existsOrError(name))
      return res
        .status(400)
        .json({ type: "error", response: "Nome de artigo inválido!" });
    if (!existsOrError(description))
      return res
        .status(400)
        .json({ type: "error", response: "Descrição inválida!" });
    if (!existsOrError(contentBuffer.toString()))
      return res
        .status(400)
        .json({ type: "error", response: "Conteúdo inválido!" });

    const userExists = await prisma.user.findUnique({ where: { id } });
    const categoryExists = await prisma.categories.findUnique({
      where: { id: categoryId },
    });

    if (!userExists)
      return res
        .status(400)
        .json({ type: "error", response: "Usuário não encontrado!" });
    if (!categoryExists)
      return res
        .status(400)
        .json({ type: "error", response: "Categoria não encontrada!" });

    const article = await prisma.articles.create({
      data: {
        name,
        description,
        imageUrl,
        content: contentBuffer,
        categoryId,
        userId: id,
      },
    });

    return res.status(200).json({
      type: "success",
      response: { ...article, content: article.content.toString() },
    });
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

const updateArticle = async (req: Request, res: Response) => {
  const { name, description, imageUrl, content }: Articles = req.body;
  const id = Number(req.params.id);
  const contentBuffer = Buffer.from(content);

  try {
    const articleExists = await prisma.articles.findUnique({ where: { id } });
    if (!articleExists)
      return res
        .status(400)
        .json({ type: "error", response: "Artigo não encontrado!" });
    if (!existsOrError(name))
      return res
        .status(400)
        .json({ type: "error", response: "Nome de artigo inválido!" });
    if (!existsOrError(description))
      return res
        .status(400)
        .json({ type: "error", response: "Descrição inválida!" });
    if (!existsOrError(contentBuffer.toString()))
      return res
        .status(400)
        .json({ type: "error", response: "Conteúdo inválido!" });

    const article = await prisma.articles.update({
      where: { id },
      data: { name, description, imageUrl, content: contentBuffer },
    });

    return res.status(200).json({
      type: "success",
      response: { ...article, content: article.content.toString() },
    });
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

const removeArticle = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const articleExists = await prisma.articles.findUnique({ where: { id } });
    if (!articleExists)
      return res
        .status(400)
        .json({ type: "error", response: "Artigo não encontrado!" });

    await prisma.articles.delete({ where: { id } });
    return res
      .status(200)
      .json({ type: "success", response: "Artigo deletado com sucesso!" });
  } catch (err: any) {
    return res.status(500).json({
      type: "error",
      response: "Ops, algo deu errado, tente novamente mais tarde!",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export {
  getArticle,
  getArticles,
  getArticleByCategory,
  postArticle,
  removeArticle,
  updateArticle,
};
