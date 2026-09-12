import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getPublicSupabaseConfig } from "@/lib/env";

export async function createServerSupabaseClient() {
  const config = getPublicSupabaseConfig();
  if (!config) {
    throw new Error("חסרות הגדרות Supabase");
  }
  const cookieStore = await cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always persist cookies. proxy.ts refreshes the session.
        }
      },
    },
  });
}
