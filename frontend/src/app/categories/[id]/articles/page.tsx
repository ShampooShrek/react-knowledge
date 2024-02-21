import CategoryArticles from "@/components/Categories/Articles";
import Layout from "@/components/Layout";
import ApiResponse from "@/models/ApiResponse";
import Category from "@/models/category";
import validAuthentication from "@/utils/validAuthentication";
import { redirect } from "next/navigation";

interface CategoryArticlesProps {
  params: { id: string };
}

export default async function CategoryArticlesPage({
  params: { id },
}: CategoryArticlesProps) {
  const token = validAuthentication();
  if (!token) redirect("/auth/signIn");

  const categoryResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${id}`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const categoryData: ApiResponse<Category> = await categoryResponse.json();

  if (categoryData.type === "error") redirect("/");

  const category = categoryData.response;

  return (
    <Layout title={category.name} subtitle="categoria" icon="bi bi-folder-fill">
      <CategoryArticles categoryId={Number(id)} />
    </Layout>
  );
}
