import Input from "@/components/Input"
import { UserFormType } from "@/models/user"
import { ChangeEvent } from "react"

interface ArticleFormProps {
  user: UserFormType
  handleUserInput(ev: ChangeEvent<HTMLInputElement>): void
  saveUser(): Promise<void>
  cancelForm(): void
}

export default function UserForm({ user, handleUserInput, saveUser, cancelForm }: ArticleFormProps) {

  return (
    <div>
      <div className="flex flex-col mb-4">
        <label className="">Nome: </label>
        <Input
          className=""
          value={user.name}
          type="text"
          onChange={handleUserInput}
          name="name"
          placeholder="Informe o Nome do Usuário..."
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-1">E-mail: </label>
        <Input
          className=""
          value={user.email}
          type="email"
          onChange={handleUserInput}
          name="email"
          placeholder="Informe a E-mail do Usuário..."
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-1">Senha:</label>
        <Input
          className=""
          value={user.password}
          type="password"
          onChange={handleUserInput}
          name="password"
          placeholder="Informe a Senha..."
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-1">Confirme a Senha:</label>
        <Input
          className=""
          value={user.confPassword}
          type="password"
          onChange={handleUserInput}
          name="confPassword"
          placeholder="Confirme a Senha..."
        />
      </div>
      <div className="flex items-center justify-start">
        <button onClick={saveUser} className="w-32 py-1 bg-green mr-2 rounded">Salvar</button>
        <button onClick={cancelForm} className="w-32 py-1 bg-red mr-2 rounded">Cancelar</button>
      </div>
    </div>
  )
}
