"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function enterDemo() {
  if (!isDemoMode()) {
    throw new Error("מצב הדגמה זמין רק בלי חיבור ל-Supabase.");
  }
  const cookieStore = await cookies();
  cookieStore.set(DEMO_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  redirect("/");
}

export async function signIn(formData: FormData) {
  if (isDemoMode()) {
    return { error: "במצב הדגמה אין התחברות עם סיסמה. השתמשי בכפתור ההדגמה." };
  }
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "יש למלא דוא״ל וסיסמה." };
  }
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "לא הצלחנו להתחבר. בדקי את הפרטים." };
  }
  redirect("/");
}

export async function signUp(formData: FormData) {
  if (isDemoMode()) {
    return { error: "במצב הדגמה אין הרשמה." };
  }
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!email || !password) {
    return { error: "יש למלא דוא״ל וסיסמה." };
  }
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName || email.split("@")[0] } },
  });
  if (error) {
    return { error: "לא הצלחנו להירשם. נסי שוב." };
  }
  redirect("/");
}

export async function signOut() {
  if (isDemoMode()) {
    const cookieStore = await cookies();
    cookieStore.delete(DEMO_COOKIE);
    redirect("/login");
  }
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
