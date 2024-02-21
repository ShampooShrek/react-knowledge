import api from "./api";

const getItensByPagination = async (updateUrl: string, page: number) => {
  const response = await api.get(`${updateUrl}?page=${page}`);
  const data = response.data;
  return data;
};

export default getItensByPagination;
