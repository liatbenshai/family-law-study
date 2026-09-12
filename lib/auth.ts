import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_USER_ID } from "@/data/seed";
import { isDemoMode } from "@/lib/env";
import { getProfile } from "@/lib/db";
import type { Profile } from "@/lib/types";

const DEMO_COOKIE = "demo_session";

export async function getCurrentUser(): Promise<Profile | null> {
  if (isDemoMode()) {
    const cookieStore = await cookies();
    if (cookieStore.get(DEMO_COOKIE)?.value !== "1") {
      return null;
    }
    return {
      id: DEMO_USER_ID,
      displayName: "ליאת",
      email: "demo@local",
      isAdmin: true,
    };
  }
  return getProfile();
}

export async function requireUser(): Promise<Profile> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin(): Promise<Profile> {
  const user = await requireUser();
  if (!user.isAdmin) {
    redirect("/");
  }
  return user;
}

export { DEMO_COOKIE };
