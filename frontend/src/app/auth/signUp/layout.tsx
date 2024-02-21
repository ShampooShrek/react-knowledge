import { Metadata } from "next"


export const metadata: Metadata = {
  title: "Criar Conta",
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
