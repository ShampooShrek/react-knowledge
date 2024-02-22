import axios from "axios";
import { getCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

const getToken = () => {
  const token = getCookie("knowledge-token");
  if (token) return token;
  return null;
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token} `;
  return config;
});

export default api;
