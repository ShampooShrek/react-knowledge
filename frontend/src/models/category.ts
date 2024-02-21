import Articles from "./articles"

interface Category {
  id: number
  name: string
  parentId: number | null,
  categories?: Category[]
  articles?: Articles[]
}

export interface CategoryWithPath extends Category {
  path: string
}

export interface CategoryFormType {
  id?: number
  name: string
  parent: string
}

export interface TreeType extends Category {
  parentNode: TreeType[]
}

export default Category
