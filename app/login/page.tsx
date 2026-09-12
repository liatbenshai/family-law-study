import { LoginForm } from "@/components/login-form";
import { getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }
  return <LoginForm demoMode={isDemoMode()} />;
}
