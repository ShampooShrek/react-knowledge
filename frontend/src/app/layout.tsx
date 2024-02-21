import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Inter } from "next/font/google";
import { PrimeReactProvider } from "primereact/api";
import StyledComponentsRegistry from "@/lib/registry";
import "./globals.css";
import Menu from "@/components/Layout/Menu";
import { SkeletonTheme } from "react-loading-skeleton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Knowledge",
  description: "Base de Conhecimento!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <PrimeReactProvider>
        <StyledComponentsRegistry>
          <SkeletonTheme baseColor="#11111b" highlightColor="#313244">
            <body className={inter.className}>
              <ToastContainer />
              <div>
                <Menu />
              </div>
              {children}
            </body>
          </SkeletonTheme>
        </StyledComponentsRegistry>
      </PrimeReactProvider>
    </html>
  );
}
