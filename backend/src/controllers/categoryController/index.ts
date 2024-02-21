import { Request, Response } from "express";
import prisma from "../../libs/prisma";
import { Categories } from "@prisma/client";
import { existsOrError } from "../../validation";

const withPath = (categories: Categories[]) => {
  const getParent = (parentId: number | null) => {
    if (parentId === null) return null
    const parent = categories.filter(c => c.id === parentId)
    return parent.length ? parent[0] : null
  }

  const categoriesWithPath = categories.map(category => {
    let path = category.name
    let parent = getParent(category.parentId)

    while (parent) {
      path = `${parent.name} > ${path}`
      parent = getParent(parent.parentId)
    }

    return { path, ...category }
  })

  categoriesWithPath.sort((a, b) => {
    if (a.path < b.path) return -1
    if (a.path > b.path) return 1
    return 1
  })

  return categoriesWithPath
}

const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categories.findMany()

    const categoriesWithPath = withPath(categories)

    return res.status(200).json({ type: "success", response: categoriesWithPath })
  } catch (err: any) {
    return res.status(500).json({ type: "error", response: "Ops, algo deu errado, tente novamente mais tarde!" })
  } finally {
    await prisma.$disconnect()
  }
}

const getCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  try {
    const category = await prisma.categories.findUnique({ where: { id }, include: { articles: true, Categories: true } })
    if (!category) return res.status(400).json({ type: "error", response: "Categoria não encontrada!" })

    return res.status(200).json({ type: "success", response: category })
  } catch (err: any) {
    return res.status(500).json({ type: "error", response: "Ops, algo deu errado, tente novamente mais tarde!" })
  } finally {
    await prisma.$disconnect()
  }
}

interface Parent extends Categories {
  parentNode?: null | Categories[]
}

const toTree = (categories: Categories[], tree?: Parent[]) => {
  if (!tree) tree = categories.filter(c => !c.parentId)
  tree = tree.map(cat => {
    cat.parentNode = toTree(categories, categories.filter(c => cat.id === c.parentId))
    return cat
  })
  return tree
}

const getTree = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categories.findMany()

    const treeOfCategores = toTree(categories)

    return res.status(200).json({ type: "success", response: treeOfCategores })

  } catch (err: any) {

  } finally {
    await prisma.$disconnect()
  }
}

const postCategory = async (req: Request, res: Response) => {
  const { name, parentId }: Categories = req.body
  console.log(name, parentId)

  try {
    if (!existsOrError(name)) return res.status(400).json({ type: "error", response: "Nome de categoria inválida!" })
    if (parentId) {
      const parentCategory = await prisma.categories.findUnique({ where: { id: parentId } })
      if (!parentCategory) return res.status(400).json({ type: "error", response: "Parente da categoria não encontrado!" })
    }

    const categoryExists = await prisma.categories.findFirst({
      where: { name }
    })

    if (categoryExists) return res.status(400).json({ type: "error", response: "Nome de categoria em uso!" })

    const category = await prisma.categories.create({ data: { name, parentId } })
    const categories = await prisma.categories.findMany()
    const categoryWithPath = withPath(categories).find(f => f.id === category.id)
    return res.status(200).json({ type: "success", response: categoryWithPath })
  } catch (err: any) {
    return res.status(500).json({ type: "error", response: "Ops, algo deu errado, tente novamente mais tarde!" })
  } finally {
    await prisma.$disconnect()
  }
}

const updateCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const name = req.body.name

  try {
    if (!existsOrError(name)) return res.status(400).json({ type: "error", response: "Nome de categoria inválido!" })

    const categoryExists = await prisma.categories.findUnique({ where: { id } })
    if (!categoryExists) return res.status(400).json({ type: "error", response: "Categoria não encontrada!" })

    const haveCategoryName = await prisma.categories.findFirst({ where: { name } })
    if (haveCategoryName && haveCategoryName.id !== id) return res.status(400).json({ type: "error", response: "Nome de categoria em uso!" })

    const category = await prisma.categories.update({ where: { id }, data: { name } })
    const categories = await prisma.categories.findMany()
    const categoryWithPath = withPath(categories).find(f => f.id === category.id)
    return res.status(200).json({ type: "success", response: categoryWithPath })
  } catch (err: any) {
    return res.status(500).json({ type: "error", response: "Ops, algo deu errado, tente novamente mais tarde!" })
  } finally {
    await prisma.$disconnect()
  }

}

const removeCategory = async (req: Request, res: Response) => {
  const id = Number(req.params.id)

  try {
    const category = await prisma.categories.findUnique({
      where: { id },
      include: {
        parent: true,
        articles: true,
        Categories: true
      }
    })
    if (!category) return res.status(400).json({ type: "error", response: "Categoria não encontrada!" })
    if (category.Categories.length > 0) return res.status(400).json({ type: "error", response: "Esta categoria pussui subcategorias!" })
    if (category.articles.length > 0) return res.status(400).json({ type: "error", response: "Esta categoria pussui artigos!" })

    await prisma.categories.delete({ where: { id } })

    return res.status(200).json({ type: "success", response: "Categoria deletada com sucesso!" })

  } catch (err: any) {
    return res.status(500).json({ type: "error", response: "Ops, algo deu errado, tente novamente mais tarde!" })
  } finally {
    await prisma.$disconnect()
  }
}

export { getCategories, getCategory, removeCategory, postCategory, getTree, updateCategory }
