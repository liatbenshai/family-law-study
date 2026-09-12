import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { requireUser } from "@/lib/auth";
import { getDueReviews, getLessonsForTopic, getProgress, getTopics } from "@/lib/db";

export default async function HomePage() {
  const user = await requireUser();
  const [topics, due, progress] = await Promise.all([
    getTopics(),
    getDueReviews(user.id),
    getProgress(user.id),
  ]);

  const completedIds = new Set(
    progress.filter((item) => item.completedAt).map((item) => item.lessonId),
  );

  let nextLesson: { id: string; title: string } | null = null;
  for (const topic of topics) {
    const lessons = await getLessonsForTopic(topic.id, false);
    const open = lessons.find((lesson) => !completedIds.has(lesson.id));
    if (open) {
      nextLesson = { id: open.id, title: open.title };
      break;
    }
  }

  return (
    <AppShell user={user}>
      <p className="text-muted">שלום {user.displayName ?? ""}</p>
      <h1 className="mt-1 text-3xl font-semibold">מה היום?</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/review"
          className="rounded-2xl border border-border bg-card p-5 hover:border-accent"
        >
          <p className="text-sm text-muted">חזרה מרווחת</p>
          <p className="mt-2 text-2xl font-semibold">{due.length} כרטיסים</p>
          <p className="mt-2 text-sm text-muted">לפי אלגוריתם SM-2</p>
        </Link>
        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.id}`}
            className="rounded-2xl border border-border bg-card p-5 hover:border-accent"
          >
            <p className="text-sm text-muted">המשיכי שיעור</p>
            <p className="mt-2 text-2xl font-semibold leading-snug">{nextLesson.title}</p>
          </Link>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted">שיעורים</p>
            <p className="mt-2 text-2xl font-semibold">הכל הושלם</p>
          </div>
        )}
      </div>

      <h2 className="mt-10 text-xl font-medium">נושאים</h2>
      {topics.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="אין נושאים עדיין" body="אפשר להוסיף תוכן מפאנל הניהול." />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {topics.map((topic) => (
            <li key={topic.id}>
              <Link
                href={`/topics/${topic.slug}`}
                className="block rounded-2xl border border-border bg-card p-5 hover:border-accent"
              >
                <h3 className="text-lg font-medium">{topic.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{topic.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
