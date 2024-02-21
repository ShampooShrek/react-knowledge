import { Metadata } from "next"


export const metadata: Metadata = {
  title: "Artigos",
  description: "Artigos Por Categoria"
}

export default function CategoryArticlesLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
