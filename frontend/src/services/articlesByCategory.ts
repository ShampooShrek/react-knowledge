import api from "./api";

const getArticlesByCategory = async (page: number = 1, categoryId: number) => {
  const response = await api.get(
    `/category/${categoryId}/articles?page=${page}`,
  );
  return response.data;
};

export default getArticlesByCategory;
