"use client";

import { useEffect, useState } from "react";
import ArticleContainer from "./Article";
import Articles from "@/models/articles";
import ApiResponse from "@/models/ApiResponse";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import getArticlesByCategory from "@/services/articlesByCategory";
import Skeleton from "react-loading-skeleton";

interface CategoryArticlesProps {
  categoryId: number;
}

export default function CategoryArticles({
  categoryId,
}: CategoryArticlesProps) {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(true);

  const { data, isLoading, error, isError, isPreviousData } = useQuery<
    ApiResponse<Articles[]>,
    AxiosError<ApiResponse<string>>
  >({
    queryKey: ["articles-by-category", page],
    queryFn: () => getArticlesByCategory(page, categoryId),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data && data.response) {
      if (data.response.length > 0) {
        const prevArticles = [...articles];
        prevArticles.push(...data.response);
        setArticles(prevArticles);
      } else {
        setLoadMore(false);
      }
    }
  }, [data]);

  if (isError) return <div>{error.response!.data.response}</div>;

  return (
    <div className="w-full">
      {!isLoading && articles ? (
        <div>
          <div>
            {articles.map((article) => (
              <ArticleContainer key={article.id} article={article} />
            ))}
          </div>
          <div className="flex items-center justify-center">
            {loadMore && (
              <button onClick={() => setPage((prev) => prev + 1)}>
                Carregar Mais
              </button>
            )}
          </div>
        </div>
      ) : (
        <Skeleton className="w-full mb-3 h-40 p-4 rounded" count={3} />
      )}
    </div>
  );
}
