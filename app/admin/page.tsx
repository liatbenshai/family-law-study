import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth";
import { getAllLessons, getTopics } from "@/lib/db";
import { topicPathLabel } from "@/lib/topic-tree";

export default async function AdminPage() {
  const user = await requireAdmin();
  const [lessons, topics] = await Promise.all([getAllLessons(), getTopics()]);
  const topicTitle = new Map(topics.map((topic) => [topic.id, topicPathLabel(topics, topic)]));

  return (
    <AppShell user={user}>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold">פאנל ניהול</h1>
        <Link href="/admin/lessons/new" className="rounded-xl bg-accent px-4 py-2 text-card">
          שיעור חדש
        </Link>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted">
        תוכן חדש נשמר כטיוטה. פרסום ללמידה רק אחרי בדיקה ואישור ידני.
      </p>
      <ul className="mt-6 space-y-3">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/admin/lessons/${lesson.id}`}
              className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-5 hover:border-accent"
            >
              <div>
                <p className="text-sm text-muted">{topicTitle.get(lesson.topicId)}</p>
                <h2 className="mt-1 text-lg font-medium">{lesson.title}</h2>
              </div>
              <StatusBadge status={lesson.status} />
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
