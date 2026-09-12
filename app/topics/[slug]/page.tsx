import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { LessonCard } from "@/components/lesson-card";
import { requireUser } from "@/lib/auth";
import { getLessonsForTopic, getProgress, getTopicBySlug } from "@/lib/db";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();

  const [lessons, progress] = await Promise.all([
    getLessonsForTopic(topic.id, user.isAdmin),
    getProgress(user.id),
  ]);
  const completedIds = new Set(
    progress.filter((item) => item.completedAt).map((item) => item.lessonId),
  );
  const visible = user.isAdmin ? lessons : lessons.filter((lesson) => lesson.status === "published");

  return (
    <AppShell user={user}>
      <h1 className="text-3xl font-semibold">{topic.title}</h1>
      <p className="mt-2 leading-7 text-muted">{topic.description}</p>
      <div className="mt-6 space-y-4">
        {visible.length === 0 ? (
          <EmptyState title="אין שיעורים מפורסמים" body="שיעורים יופיעו כאן אחרי אישור ידני." />
        ) : (
          visible.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              href={`/lessons/${lesson.id}`}
              completed={completedIds.has(lesson.id)}
              showStatus={user.isAdmin}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
