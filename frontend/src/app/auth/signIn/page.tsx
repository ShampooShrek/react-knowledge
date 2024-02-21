import SignIn from "@/components/Auth/SignIn";
import validAuthentication from "@/utils/validAuthentication";
import { redirect } from "next/navigation";

export default function SignInPage() {
  const token = validAuthentication();
  if (token) redirect("/");

  return <SignIn />;
}
