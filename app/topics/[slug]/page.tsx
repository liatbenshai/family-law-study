import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { LessonCard } from "@/components/lesson-card";
import { TopicSummary } from "@/components/topic-summary";
import { requireUser } from "@/lib/auth";
import { getLessonsForTopic, getProgress, getTopics, getTopicBySlug } from "@/lib/db";
import { childTopics, topicById } from "@/lib/topic-tree";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const [topic, topics] = await Promise.all([getTopicBySlug(slug), getTopics()]);
  if (!topic) notFound();

  const parent = topic.parentId ? topicById(topics, topic.parentId) : null;
  const children = childTopics(topics, topic.id);
  const [directLessons, progress] = await Promise.all([
    getLessonsForTopic(topic.id, false, false),
    getProgress(user.id),
  ]);
  const completedIds = new Set(
    progress.filter((item) => item.completedAt).map((item) => item.lessonId),
  );

  const childRows = await Promise.all(
    children.map(async (child) => {
      const lessons = await getLessonsForTopic(child.id, false, true);
      return {
        topic: child,
        total: lessons.length,
        completed: lessons.filter((lesson) => completedIds.has(lesson.id)).length,
      };
    }),
  );

  const visible = directLessons.filter((lesson) => lesson.status === "published");

  return (
    <AppShell user={user}>
      {parent ? (
        <p className="text-sm text-muted">
          <Link href={`/topics/${parent.slug}`} className="hover:text-accent">
            {parent.title}
          </Link>
        </p>
      ) : null}
      <h1 className="text-3xl font-semibold">{topic.title}</h1>
      <p className="mt-2 leading-7 text-muted">{topic.description}</p>

      {childRows.length > 0 ? (
        <div className="mt-6 space-y-3">
          <h2 className="text-lg font-medium">תתי-נושאים</h2>
          {childRows.map((row) => (
            <TopicSummary
              key={row.topic.id}
              topic={row.topic}
              completed={row.completed}
              total={row.total}
            />
          ))}
        </div>
      ) : null}

      <div className={childRows.length > 0 ? "mt-8 space-y-4" : "mt-6 space-y-4"}>
        {childRows.length > 0 ? <h2 className="text-lg font-medium">שיעורים</h2> : null}
        {visible.length === 0 && childRows.length === 0 ? (
          <EmptyState title="אין שיעורים מפורסמים" body="שיעורים יופיעו כאן אחרי אישור ידני." />
        ) : visible.length === 0 && childRows.length > 0 ? (
          <p className="text-sm text-muted">בחרי תת-נושא כדי לראות את השיעורים שבו.</p>
        ) : (
          visible.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              href={`/lessons/${lesson.id}`}
              completed={completedIds.has(lesson.id)}
              showStatus={false}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
