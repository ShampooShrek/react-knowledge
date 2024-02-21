import { Metadata } from "next"


export const metadata: Metadata = {
  title: "Entrar",
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
