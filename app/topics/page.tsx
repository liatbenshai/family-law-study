import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/auth";
import { getLessonsForTopic, getProgress, getTopics } from "@/lib/db";

export default async function TopicsPage() {
  const user = await requireUser();
  const [topics, progress] = await Promise.all([getTopics(), getProgress(user.id)]);
  const completedIds = new Set(
    progress.filter((item) => item.completedAt).map((item) => item.lessonId),
  );

  const rows = await Promise.all(
    topics.map(async (topic) => {
      const lessons = await getLessonsForTopic(topic.id, false);
      return {
        topic,
        total: lessons.length,
        completed: lessons.filter((lesson) => completedIds.has(lesson.id)).length,
      };
    }),
  );

  return (
    <AppShell user={user}>
      <h1 className="text-3xl font-semibold">נושאים</h1>
      <ul className="mt-6 space-y-4">
        {rows.map(({ topic, total, completed }) => (
          <li key={topic.id}>
            <Link
              href={`/topics/${topic.slug}`}
              className="block rounded-2xl border border-border bg-card p-5 hover:border-accent"
            >
              <h2 className="text-xl font-medium">{topic.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{topic.description}</p>
              <p className="mt-3 text-sm text-muted">
                {completed} מתוך {total} שיעורים
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
