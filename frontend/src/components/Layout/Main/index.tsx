"use client";

import { useAppSelector } from "@/lib/store";
import { Container } from "./style";

interface MainProps {
  title: string;
  subtitle: string;
  icon: string;
  children: React.ReactNode;
}

export default function Main({ children, title, subtitle, icon }: MainProps) {
  const visible = useAppSelector((state) => state.auth.isMenuVisible);

  return (
    <Container
      visible={visible ?? false}
      className="ml-auto p-6 mt-12 transition-all duration-300 bg-[#1e1e2e]"
    >
      <div className="">
        <h2 className="text-2xl flex items-center lg:text-4xl">
          <i className={`${icon} mr-2`}></i>
          {title}
        </h2>
        <span className="text-[#bbb] text-sm lg:text-lg">{subtitle}</span>
      </div>
      <div className="w-11/12 h-[2px] bg-crust my-6 mx-auto" />
      <div>{children}</div>
    </Container>
  );
}
