import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import type { Profile } from "@/lib/types";

export function AppShell({
  user,
  children,
}: {
  user: Profile;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col px-4 pb-16 pt-6">
      <header className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <div>
          <p className="text-sm text-muted">לימוד עצמי</p>
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            דיני משפחה
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link className="hover:text-accent" href="/">
            בית
          </Link>
          <Link className="hover:text-accent" href="/topics">
            נושאים
          </Link>
          <Link className="hover:text-accent" href="/review">
            חזרה
          </Link>
          {user.isAdmin ? (
            <Link className="hover:text-accent" href="/admin">
              ניהול
            </Link>
          ) : null}
        </nav>
        <form action={signOut} className="ms-auto">
          <button type="submit" className="text-sm text-muted hover:text-foreground">
            יציאה
          </button>
        </form>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-12 border-t border-border pt-4 text-sm leading-6 text-muted">
        החומר מיועד ללימוד אישי ואינו ייעוץ משפטי. כל שיעור מציין את מקורותיו.
      </footer>
    </div>
  );
}
