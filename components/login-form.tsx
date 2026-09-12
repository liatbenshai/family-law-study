"use client";

import { useState } from "react";
import { enterDemo, signIn, signUp } from "@/app/actions/auth";

export function LoginForm({ demoMode }: { demoMode: boolean }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    const result = mode === "signin" ? await signIn(formData) : await signUp(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4">
      <h1 className="text-3xl font-semibold">דיני משפחה</h1>
      <p className="mt-2 leading-7 text-muted">לימוד עצמי קצר, בעברית, עם חזרה מרווחת.</p>

      {demoMode ? (
        <form action={enterDemo} className="mt-8">
          <button
            type="submit"
            className="w-full rounded-xl bg-accent px-5 py-3 text-card hover:opacity-90"
          >
            כניסה ללמידה
          </button>
          <p className="mt-3 text-sm leading-6 text-muted">
            אין חיבור ל-Supabase כרגע, לכן האפליקציה רצה במצב מקומי. אחרי חיבור הענן,
            ההתחברות תעבור לחשבון אמיתי.
          </p>
        </form>
      ) : (
        <form action={onSubmit} className="mt-8 space-y-4">
          {mode === "signup" ? (
            <label className="block space-y-1 text-sm">
              <span>שם</span>
              <input
                name="displayName"
                className="w-full rounded-xl border border-border bg-card px-3 py-2"
              />
            </label>
          ) : null}
          <label className="block space-y-1 text-sm">
            <span>דוא״ל</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-border bg-card px-3 py-2"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span>סיסמה</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-border bg-card px-3 py-2"
            />
          </label>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-xl bg-accent px-5 py-3 text-card hover:opacity-90"
          >
            {mode === "signin" ? "כניסה" : "הרשמה"}
          </button>
          <button
            type="button"
            className="text-sm text-muted"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "אין חשבון? הרשמה" : "יש חשבון? כניסה"}
          </button>
        </form>
      )}
    </div>
  );
}
