import Admin from "@/components/Admin";
import Layout from "@/components/Layout";
import ApiResponse from "@/models/ApiResponse";
import User from "@/models/user";
import validAuthentication from "@/utils/validAuthentication";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Administração",
};

export default async function AdminPage() {
  const token = validAuthentication();
  if (!token) redirect("/auth/signIn");

  const authenticationResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/authenticate`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const authenticationData: ApiResponse<User> =
    await authenticationResponse.json();
  if (
    authenticationData.type === "error" ||
    authenticationData.response.admin === false
  )
    redirect("/");

  console.log(authenticationData);

  const categoriesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const articlesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/articles`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const usersResponse: Response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
    {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const [
    { response: categories },
    { response: articles },
    { response: users },
  ] = await Promise.all([
    categoriesResponse.json(),
    articlesResponse.json(),
    usersResponse.json(),
  ]);

  return (
    <Layout
      title="Adminstração do Sistema"
      subtitle="Cadastro & Cia"
      icon="bi bi-gear-fill"
    >
      <Admin articles={articles} users={users} categories={categories} />
    </Layout>
  );
}
