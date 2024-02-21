"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import Header from "./Header";
import Main from "./Main";
import ReduxProvider from "@/lib/StoreProvider";

interface LayoutProps {
  children: React.ReactNode;
  token?: string;
  title: string;
  subtitle: string;
  icon: string;
}

export default function Layout({
  children,
  subtitle,
  title,
  icon,
}: LayoutProps) {
  const queryClient = new QueryClient();

  return (
    <ReduxProvider>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Main title={title} subtitle={subtitle} icon={icon}>
          {children}
        </Main>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
