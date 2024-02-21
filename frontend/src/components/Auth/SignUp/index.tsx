"use client";

import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import ApiResponse from "@/models/ApiResponse";
import api from "@/services/api";
import Link from "next/link";
import { useState } from "react";
import { AxiosError } from "axios";
import notification from "@/utils/notification";
import { QueryClient, QueryClientProvider } from "react-query";
import ReduxProvider from "@/lib/StoreProvider";
import Header from "@/components/Layout/Header";

interface AuthRegisterType {
  name: string;
  email: string;
  password: string;
  confPassword: string;
}

export default function SignUp() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        <Header />
        <Content />
      </ReduxProvider>
    </QueryClientProvider>
  );
}

function Content() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthRegisterType>({
    email: "",
    password: "",
    name: "",
    confPassword: "",
  });

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setAuth((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async () => {
    try {
      const response = await api.post("/users", auth);
      const data: ApiResponse<string> = response.data;
      if (data.type === "success") {
        router.push("/auth/signIn");
      }
    } catch (e: any) {
      const error = e as AxiosError<ApiResponse<string>>;
      notification(error.response?.data.response, "error");
    }
  };

  return (
    <div className="mt-40 mx-auto p-6 w-72 shadow bg-zinc-200 border border-black flex flex-col justify-between items-center rounded">
      <h3 className="text-2xl text-black font-bold">Cadastro</h3>
      <div className="w-full flex flex-col justify-between my-2">
        <Input
          type="text"
          name="name"
          placeholder="Nome completo"
          onChange={handleInput}
          value={auth.name}
          className="w-full my-1"
        />
        <Input
          type="email"
          name="email"
          placeholder="E-mail"
          onChange={handleInput}
          value={auth.email}
          className="w-full my-1"
        />
        <Input
          type="password"
          name="password"
          placeholder="Senha"
          onChange={handleInput}
          value={auth.password}
          className="w-full my-1"
        />
        <Input
          type="password"
          name="confPassword"
          placeholder="Confirmar Senha"
          onChange={handleInput}
          value={auth.confPassword}
          className="w-full my-1"
        />
        <div className="w-full flex justify-end">
          <button
            onClick={handleSignUp}
            className="my-1 text-xs w-28 py-1 border border-black bg-blue"
          >
            Cadastrar
          </button>
        </div>
      </div>
      <div className="w-full mt-2 text-center ">
        <span className="text-xs text-black">
          Já tem uma conta?{" "}
          <Link
            className="text-blue-400 underline cursor-pointer"
            href="/auth/signIn"
          >
            Entre!
          </Link>
        </span>
      </div>
    </div>
  );
}
