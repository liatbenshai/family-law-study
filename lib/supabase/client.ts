import { createBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseConfig } from "@/lib/env";

export function createBrowserSupabaseClient() {
  const config = getPublicSupabaseConfig();
  if (!config) {
    throw new Error("חסרות הגדרות Supabase");
  }
  return createBrowserClient(config.url, config.anonKey);
}
