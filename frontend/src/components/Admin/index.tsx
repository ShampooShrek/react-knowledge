"use client"

import { useEffect, useState } from "react"
import AdminArticles from "./AdminArticles"
import Articles from "@/models/articles"
import Category, { CategoryWithPath } from "@/models/category"
import User from "@/models/user"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setAllArticles } from "@/lib/features/articles/articleSlice"
import { ApiServiceResponse } from "@/models/ApiResponse"
import { setAllCategories } from "@/lib/features/categories/categoriesSlice"
import { setAllUsers } from "@/lib/features/user/userSlice"
import AdminCategories from "./AdminCategories"
import AdminUsers from "./AdminUsers"

type Pages = "articles" | "categories" | "users"

interface AdminProps {
  articles: ApiServiceResponse<Articles[]>
  categories: CategoryWithPath[]
  users: User[]
}

export default function Admin({ articles, categories, users }: AdminProps) {
  const [page, setPage] = useState<Pages>("articles")
  const [modificated, setModificated] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setAllArticles(articles))
    dispatch(setAllCategories(categories))
    dispatch(setAllUsers(users))
  }, [])

  useEffect(() => {
    setModificated(false)
  }, [page])

  const handleSetModificated = (modificate: boolean) =>
    setModificated(modificate)

  const handleSetPage = (nextPage: Pages) => {
    if (page !== nextPage) {
      if (modificated) {
        if (confirm("Existem alterações não salvas no formulário, deseja continuar?")) {
          setPage(nextPage)
        }
      } else {
        setPage(nextPage)
      }
    }
  }

  return (
    <div className="p-4 rounded-lg bg-crust">
      <div className="inline-flex my-4">
        <span onClick={() => handleSetPage("articles")} className={`mr-3 ${page === 'articles' && "underline text-blue"} cursor-pointer hover:text-blue `}>
          Artigos
        </span>
        <span onClick={() => handleSetPage("categories")} className={`mr-3 ${page === 'categories' && "underline text-blue"} cursor-pointer hover:text-blue `}>
          Categorias
        </span>
        <span onClick={() => handleSetPage("users")} className={`mr-3 ${page === 'users' && "underline text-blue"} cursor-pointer hover:text-blue `}>
          Usuários
        </span>
      </div>
      <div>
        {page === "articles" && <AdminArticles setModificated={handleSetModificated} />}
        {page === "categories" && <AdminCategories setModificated={handleSetModificated} />}
        {page === "users" && <AdminUsers setModificated={handleSetModificated} />}
      </div>
    </div>
  )
}
