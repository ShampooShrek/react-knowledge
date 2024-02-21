import ApiResponse from "@/models/ApiResponse";
import api from "./api";
import { TreeType } from "@/models/category";

const getTree = async () => {
  const response = await api.get("/categories/tree");
  const data: ApiResponse<TreeType[]> = response.data;
  return data;
};
export default getTree;
