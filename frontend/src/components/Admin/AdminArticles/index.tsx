import ApiResponse from "@/models/ApiResponse";
import Articles, { ArticleFormType } from "@/models/articles";
import api from "@/services/api";
import { AxiosError } from "axios";
import ArticleForm from "./ArticleForm";
import { ChangeEvent, useEffect, useState } from "react";
import AdminTable from "../AdminTable";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  addArticle,
  removeArticle,
  setAllArticles,
  updateArticle,
} from "@/lib/features/articles/articleSlice";
import PaginationWithRequest from "../AdminPagination/PaginationWIthRequest";
import notification from "@/utils/notification";

interface AdminArticlesProps {
  setModificated(modificated: boolean): void;
}

const defaultArticle: ArticleFormType = {
  name: "",
  description: "",
  imageUrl: "",
  content: "",
  category: "",
  user: "",
};

export default function AdminArticles({ setModificated }: AdminArticlesProps) {
  const [article, setArticle] = useState<ArticleFormType>(defaultArticle);

  const dispatch = useAppDispatch();
  const {
    articles: { articles },
    categories: { categories },
    users: { users },
  } = useAppSelector((state) => state);

  const setDefault = () => {
    setArticle(defaultArticle);
    setModificated(false);
  };

  const handleArticleInput = (ev: ChangeEvent<HTMLInputElement>) => {
    setModificated(true);
    const { value, name } = ev.target;
    setArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryPath = (value: string) => {
    setArticle((prev) => ({ ...prev, category: value }));
  };

  const handleUser = (value: string) => {
    setArticle((prev) => ({ ...prev, user: value }));
  };

  const saveArticle = async () => {
    const userByEmail = users!.find((f) => f.email === article.user);
    const categoryByPath = categories!.find((f) => f.path === article.category);

    if (!userByEmail) {
      notification("Usuario não encontrado!", "error");
      return;
    } else if (!categoryByPath) {
      notification("Categoria não encontrada!", "error");
      return;
    }

    const articleData = {
      ...article,
      categoryId: categoryByPath.id,
      userId: userByEmail.id,
    };

    if (article.id) {
      try {
        const response = await api.put(`/articles/${article.id}`, articleData);
        const data: ApiResponse<Articles> = response.data;
        dispatch(updateArticle(data.response));
        setDefault();
        notification("Artigo atualizado com sucesso!", "success");
      } catch (e: any) {
        const error = e as AxiosError<ApiResponse<string>>;
        notification(error.response?.data.response, "error");
      }
    } else {
      try {
        const response = await api.post(`/articles`, articleData);
        const data: ApiResponse<Articles> = response.data;
        dispatch(addArticle(data.response));
        setDefault();
        notification("Artigo criado com sucesso!", "success");
      } catch (e: any) {
        const error = e as AxiosError<ApiResponse<string>>;
        notification(error.response?.data.response, "error");
      }
    }
  };

  const deleteArticle = async (articleId: number) => {
    try {
      const response = await api.delete(`/articles/${articleId}`);
      const data: ApiResponse<string> = response.data;
      dispatch(removeArticle(articleId));
      notification("Artigo excluido com sucesso!", "success");
    } catch (e: any) {
      const error = e as AxiosError<ApiResponse<string>>;
      notification(error.response!.data.response, "error");
    }
  };

  const editorTextHandler = (value: string | null) => {
    setArticle((prev) => ({ ...prev, content: value ?? "" }));
  };

  const setEdit = (article: Articles | ArticleFormType) => {
    if (typeof article.category === "string") {
      article = article as ArticleFormType;
      setArticle(article);
    } else {
      const a = article as Articles;
      const categoryPath = categories!.find(
        (f) => f.name === a.category.name,
      )!.path;
      setArticle({ ...article, category: categoryPath!, user: a.user!.email });
    }
  };

  return (
    <div>
      <ArticleForm
        setUser={handleUser}
        setCategory={handleCategoryPath}
        saveArticle={saveArticle}
        article={article}
        handleArticleInput={handleArticleInput}
        cancelForm={setDefault}
        editorTextHandler={editorTextHandler}
      />
      <AdminTable tableTds={["Código", "Nome", "Descrição", "Ações"]}>
        {articles &&
          articles.data.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.description}</td>
              <td className="flex flex-col items-start justify-start">
                <button onClick={() => setEdit(e)}>Editar</button>
                <button onClick={() => deleteArticle(e.id)}>Deletar</button>
              </td>
            </tr>
          ))}
      </AdminTable>
      {articles && (
        <PaginationWithRequest
          count={articles.count}
          updateUrl="/articles"
          updateFunction={setAllArticles}
          limit={articles.limit}
        />
      )}
    </div>
  );
}
