import ApiResponse from "@/models/ApiResponse";
import api from "@/services/api";
import { AxiosError } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import AdminTable from "../AdminTable";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import Category, {
  CategoryFormType,
  CategoryWithPath,
} from "@/models/category";
import CategoryForm from "./CategoryForm";
import Pagination from "../AdminPagination";
import {
  addCategory,
  removeCategory,
  updateCategory,
} from "@/lib/features/categories/categoriesSlice";
import notification from "@/utils/notification";

interface AdminCategoriesProps {
  setModificated(modificated: boolean): void;
}

const defaultCategory: CategoryFormType = {
  name: "",
  parent: "",
};

export default function AdminCategories({
  setModificated,
}: AdminCategoriesProps) {
  const [category, setCategory] = useState<CategoryFormType>(defaultCategory);
  const [categoriesPagination, setCategoriesPagination] = useState<
    CategoryWithPath[]
  >([]);

  const setDefault = () => {
    setModificated(false);
    setCategory(defaultCategory);
  };

  const dispatch = useAppDispatch();
  const {
    categories: { categories },
  } = useAppSelector((state) => state);

  const handleCategoryName = (name: string) => {
    setCategory((prev) => ({ ...prev, name }));
  };

  const handleCategoryParent = (value: string) => {
    setCategory((prev) => ({ ...prev, parent: value }));
  };

  const handlePaginationData = (data: CategoryWithPath[]) => {
    setCategoriesPagination(data);
  };

  const saveCategory = async () => {
    const findCategoryByParent = category!.parent
      ? categories!.find((f) => f.path === category.parent)?.id
      : null;
    if (findCategoryByParent === undefined) {
      notification("Categoria não encontrada!", "error");
      return;
    }

    const categoryData: { name: string; parentId: number | null } = {
      name: category.name,
      parentId: findCategoryByParent,
    };

    if (category.id) {
      try {
        const response = await api.put(
          `/categories/${category.id}`,
          categoryData,
        );
        const data: ApiResponse<CategoryWithPath> = response.data;
        dispatch(updateCategory(data.response));
        setDefault();
        notification("Categoria atualizada com sucesso!", "success");
      } catch (e: any) {
        const error = e as AxiosError<ApiResponse<string>>;
        notification(error.response?.data.response, "error");
      }
    } else {
      try {
        const response = await api.post(`/categories`, categoryData);
        const data: ApiResponse<CategoryWithPath> = response.data;
        dispatch(addCategory(data.response));
        setDefault();
        notification("Categoria criada com sucesso!", "success");
      } catch (e: any) {
        const error = e as AxiosError<ApiResponse<string>>;
        notification(error.response?.data.response, "error");
      }
    }
  };

  const deleteCategory = async (categoryId: number) => {
    try {
      const response = await api.delete(`/categories/${categoryId}`);
      const data: ApiResponse<string> = response.data;
      dispatch(removeCategory(categoryId));
      notification("Categoria removida com sucesso!", "success");
    } catch (e: any) {
      const error = e as AxiosError<ApiResponse<string>>;
      notification(error.response!.data.response, "error");
    }
  };

  const setEdit = (category: CategoryWithPath) => {
    const editCategory: CategoryFormType = {
      name: category.name,
      parent: category.path,
      id: category.id,
    };
    setCategory(editCategory);
  };

  return (
    <div>
      <CategoryForm
        category={category}
        saveCategory={saveCategory}
        cancelForm={setDefault}
        setCategoryName={handleCategoryName}
        setCategoryParent={handleCategoryParent}
      />
      <AdminTable tableTds={["Código", "Nome", "Path", "Ações"]}>
        {categoriesPagination &&
          categoriesPagination.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.name}</td>
              <td>{e.path}</td>
              <td className="flex flex-col items-start justify-start">
                <button onClick={() => setEdit(e)}>Editar</button>
                <button onClick={() => deleteCategory(e.id)}>Deletar</button>
              </td>
            </tr>
          ))}
      </AdminTable>
      {categories && (
        <Pagination
          data={categories}
          paginationData={handlePaginationData}
          limit={2}
        />
      )}
    </div>
  );
}
