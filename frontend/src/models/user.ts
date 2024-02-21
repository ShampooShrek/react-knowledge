import Articles from "./articles"

interface User {
  id: number
  name: string
  email: string
  password: string
  admin: boolean
  articles?: Articles[]
}

export interface UserFormType {
  id?: number
  name: string
  email: string
  password: string
  confPassword: string
}

export interface UserLogin extends User {
  token?: string
}

export default User
