import Article from "@/components/Article";
import Layout from "@/components/Layout";
import ApiResponse from "@/models/ApiResponse";
import Articles from "@/models/articles";
import validAuthentication from "@/utils/validAuthentication";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Artigo",
};

interface ArticlesPageProps {
  params: { id: string };
}

export default async function ArticlesPage({
  params: { id },
}: ArticlesPageProps) {
  const token = validAuthentication();
  if (!token) redirect("/auth/signIn");

  const articleResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${id}`,
    {
      cache: "no-store",
    },
  );
  const articleData: ApiResponse<Articles> = await articleResponse.json();
  if (articleData.type === "error") redirect("/");

  const article = articleData.response;

  return (
    <Layout
      title={article.name}
      subtitle={article.description}
      icon="bi bi-file-earmark-fill"
    >
      <Article article={article} />
    </Layout>
  );
}
