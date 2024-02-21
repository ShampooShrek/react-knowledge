import SignUp from "@/components/Auth/SignUp";
import validAuthentication from "@/utils/validAuthentication";
import { redirect } from "next/navigation";

export default function SignUpPage() {
  const token = validAuthentication();
  if (token) redirect("/");
  return <SignUp />;
}
