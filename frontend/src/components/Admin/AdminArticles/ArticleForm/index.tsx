"use client";

import DropDownInput from "@/components/DropDownInput";
import Input from "@/components/Input";
import { useAppSelector } from "@/lib/store";
import { ArticleFormType } from "@/models/articles";
import { Editor } from "primereact/editor";
import { ChangeEvent, useEffect, useState } from "react";

interface ArticleFormProps {
  article: ArticleFormType;
  handleArticleInput(ev: ChangeEvent<HTMLInputElement>): void;
  setCategory(value: string, id?: number): void;
  setUser(value: string, id?: number): void;
  saveArticle(): Promise<void>;
  cancelForm(): void;
  editorTextHandler(value: string | null): void;
}

export default function ArticleForm({
  setUser,
  setCategory,
  saveArticle,
  article,
  handleArticleInput,
  cancelForm,
  editorTextHandler,
}: ArticleFormProps) {
  const categories = useAppSelector((state) => state.categories.categories);
  const users = useAppSelector((state) => state.users.users);

  const [categoriesList, setCategoriesList] = useState<
    { value: number; text: string }[]
  >([]);
  const [usersList, setUsersList] = useState<{ value: number; text: string }[]>(
    [],
  );

  useEffect(() => {
    if (categories) {
      setCategoriesList(categories.map((d) => ({ value: d.id, text: d.path })));
    }
  }, [categories]);

  useEffect(() => {
    if (users) {
      console.log(users);
      setUsersList(users.map((d) => ({ value: d.id, text: d.email })));
    }
  }, [users]);

  return (
    <div>
      <div className="flex flex-col mb-4 ">
        <label className="">Nome: </label>
        <Input
          className=""
          value={article.name}
          type="text"
          onChange={handleArticleInput}
          name="name"
          placeholder="Informe o Nome do Artigo..."
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-1">Descrição: </label>
        <Input
          className=""
          value={article.description}
          type="text"
          onChange={handleArticleInput}
          name="description"
          placeholder="Informe a Descrição do Artigo..."
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-1">Imagem (URL): </label>
        <Input
          className=""
          value={article.imageUrl}
          type="text"
          onChange={handleArticleInput}
          name="imageUrl"
          placeholder="Informe a Url da Imagem..."
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-1">Categoria: </label>
        <DropDownInput
          onChange={(ev) => setCategory(ev.target.value)}
          value={article.category}
          placeholder="Selecione a categoria"
          selectData={(path) => setCategory(path)}
          dropDownData={categoriesList}
          className="w-full"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-1">Autor: </label>
        <DropDownInput
          className="w-full"
          value={article.user}
          onChange={(ev) => setUser(ev.target.value)}
          placeholder="Informe o Autor do Artigo..."
          dropDownData={usersList}
          selectData={(path) => setUser(path)}
        />
      </div>
      <div className="flex flex-col mb-4">
        <label className="mb-1">Conteudo: </label>
        <Editor
          value={article.content.toString()}
          onTextChange={(ev) => editorTextHandler(ev.htmlValue)}
          className="bg-mantle border-crust border-0 text-white"
          style={{ height: "320px", borderColor: "#11111b" }}
        />
      </div>
      <div className="flex items-center justify-start">
        <button
          onClick={saveArticle}
          className="w-32 py-1 bg-green mr-2 rounded"
        >
          Salvar
        </button>
        <button onClick={cancelForm} className="w-32 py-1 bg-red mr-2 rounded">
          Cancelar
        </button>
      </div>
    </div>
  );
}
