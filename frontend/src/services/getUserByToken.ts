import ApiResponse from "@/models/ApiResponse";
import api from "./api";
import User from "@/models/user";

const getUserByToken = async () => {
  try {
    const response = await api.get("/authenticate");
    const data: ApiResponse<User> = response.data;
    return data;
  } catch (err: any) {
    return err;
  }
};

export default getUserByToken;
