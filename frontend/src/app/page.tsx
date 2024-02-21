import HomeComponent from "@/components/Home";
import Layout from "@/components/Layout";
import ApiResponse from "@/models/ApiResponse";
import Status from "@/models/status";
import Head from "next/head";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const useCookies = cookies();
  const token = useCookies.get("knowledge-token");
  if (!token || !token.value) redirect("/auth/signIn");

  const statusResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/status`,
    {
      cache: "no-cache",
    },
  );
  const status: ApiResponse<Status> = await statusResponse.json();

  return (
    <div>
      <Layout
        title="Dashboard"
        subtitle="Base de Conhecimento"
        icon="bi bi-house-door-fill"
      >
        <HomeComponent status={status.response} />
      </Layout>
    </div>
  );
}
