import Category from "./category"
import User from "./user"

interface Articles {
  id: number
  name: string
  description: string
  content: string | Buffer
  imageUrl: string
  user?: User
  category: Category
}

export interface ArticleFormType extends Omit<Articles, 'id' | 'category' | 'user'> {
  id?: number | null
  category: string
  user: string
}


export default Articles
