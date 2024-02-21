
"use client"

import DropDownInput from "@/components/DropDownInput"
import Input from "@/components/Input"
import { useAppSelector } from "@/lib/store"
import { CategoryFormType } from "@/models/category"
import { useEffect, useState } from "react"

interface CategoryFormProps {
  category: CategoryFormType
  setCategoryName(value: string): void
  setCategoryParent(parent: string, id?: number): void
  saveCategory(): Promise<void>
  cancelForm(): void
}

export default function CategoryForm({ category, setCategoryName, setCategoryParent, saveCategory, cancelForm }: CategoryFormProps) {

  const categories = useAppSelector(state => state.categories.categories)

  const [categoriesList, setCategoriesList] = useState<{ value: number, text: string }[]>([])

  useEffect(() => {
    if (categories) {
      setCategoriesList(categories.map(d => ({ value: d.id, text: d.path })))
    }
  }, [categories])


  return (
    <div>
      <div className="flex flex-col mb-4">
        <label className="">Nome: </label>
        <Input
          className=""
          value={category.name}
          type="text"
          onChange={ev => setCategoryName(ev.target.value)}
          name="name"
          placeholder="Informe o Nome do Artigo..."
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-1">Categoria: </label>
        <DropDownInput
          onChange={ev => setCategoryParent(ev.target.value)}
          value={category.parent}
          placeholder="Selecione a categoria pai"
          selectData={path => setCategoryParent(path)}
          dropDownData={categoriesList}
          className="w-full"
        />
      </div>
      <div className="flex items-center justify-start">
        <button onClick={saveCategory} className="w-32 py-1 bg-green mr-2 rounded">Salvar</button>
        <button onClick={cancelForm} className="w-32 py-1 bg-red mr-2 rounded">Cancelar</button>
      </div>
    </div>
  )
}

