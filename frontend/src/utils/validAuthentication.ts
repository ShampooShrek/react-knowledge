import { cookies } from "next/headers"

export default function validAuthentication(): false | string {
  const useCookies = cookies()
  const token = useCookies.get("knowledge-token")
  if (!token || !token.value) return false
  else return token.value
}

