"use client";

import Input from "@/components/Input";
import Header from "@/components/Layout/Header";
import ReduxProvider from "@/lib/StoreProvider";
import { setUser } from "@/lib/features/user/authSlice";
import { useAppDispatch } from "@/lib/store";
import ApiResponse from "@/models/ApiResponse";
import User, { UserLogin } from "@/models/user";
import api from "@/services/api";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import notification from "@/utils/notification";
import { QueryClient, QueryClientProvider } from "react-query";

interface AuthLoginType {
  email: string;
  password: string;
}

export default function SignIn() {
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
  const [auth, setAuth] = useState<AuthLoginType>({ email: "", password: "" });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = ev.target;
    setAuth((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async () => {
    try {
      const request = await api.post("/signIn", auth);
      const response: ApiResponse<UserLogin> = request.data;
      if (response.type === "success") {
        dispatch(setUser(response.response as UserLogin));
        router.push("/");
      }
    } catch (e: any) {
      const error = e as AxiosError<ApiResponse<string>>;
      notification(error.response?.data.response, "error");
    }
  };

  return (
    <div className="mt-40 mx-auto p-6 w-72 shadow bg-zinc-200 border border-black flex flex-col justify-between items-center rounded">
      <h3 className="text-2xl text-black font-bold">Login</h3>
      <div className="w-full flex flex-col justify-between my-2">
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
        <div className="w-full flex justify-end">
          <button
            onClick={handleSignIn}
            className="my-1 text-xs w-28 py-1 border border-black bg-blue"
          >
            Entrar
          </button>
        </div>
      </div>
      <div className="w-full mt-2 text-center ">
        <span className="text-xs text-black">
          Não tem cadastro?{" "}
          <Link
            className="text-blue-400 underline cursor-pointer"
            href="/auth/signUp"
          >
            {" "}
            Registre-se!{" "}
          </Link>{" "}
        </span>
      </div>
    </div>
  );
}
