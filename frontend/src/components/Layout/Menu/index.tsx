"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/store";
import { SearchIcon } from "@/components/icons";
import Tree from "./Tree";
import ReduxProvider from "@/lib/StoreProvider";
import { QueryClient, QueryClientProvider } from "react-query";

export default function Main() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider>
        <Content />
      </ReduxProvider>
    </QueryClientProvider>
  );
}

function Content() {
  const [filter, setFilter] = useState("");
  const { isMenuVisible: visible, user } = useAppSelector(
    (state) => state.auth,
  );

  if (!user) return <></>;

  return (
    <aside
      className={`
        z-40
        w-full bg-gradient-to-r from-crust to-surface flex 
        flex-col flex-wrap fixed top-12 left-0 h-full md:w-60 
        ${!visible && "translate-x-[-100%]"} transition-transform duration-300
      `}
    >
      <div className="flex items-center justify-center m-2 p-2 border-b-2 border-white">
        <SearchIcon className="mr-2 text-zinc-300 w-6 h-6 " />
        <input
          value={filter}
          onChange={(ev) => setFilter(ev.target.value)}
          className="text-white text-xl  outline-0 w-full bg-transparent"
        />
      </div>
      <Tree filter={filter} />
    </aside>
  );
}
