import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { TopicSummary } from "@/components/topic-summary";
import { requireUser } from "@/lib/auth";
import { getLessonsForTopic, getProgress, getTopics } from "@/lib/db";
import { childTopics, parentTopics } from "@/lib/topic-tree";

export default async function TopicsPage() {
  const user = await requireUser();
  const [topics, progress] = await Promise.all([getTopics(), getProgress(user.id)]);
  const completedIds = new Set(
    progress.filter((item) => item.completedAt).map((item) => item.lessonId),
  );

  const rows = await Promise.all(
    parentTopics(topics).map(async (topic) => {
      const lessons = await getLessonsForTopic(topic.id, false, true);
      const children = await Promise.all(
        childTopics(topics, topic.id).map(async (child) => {
          const childLessons = await getLessonsForTopic(child.id, false, true);
          return {
            topic: child,
            total: childLessons.length,
            completed: childLessons.filter((lesson) => completedIds.has(lesson.id)).length,
          };
        }),
      );
      return {
        topic,
        total: lessons.length,
        completed: lessons.filter((lesson) => completedIds.has(lesson.id)).length,
        children,
      };
    }),
  );

  return (
    <AppShell user={user}>
      <h1 className="text-3xl font-semibold">נושאים</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        שמונה פרקים. לכל פרק תתי-נושאים, ורק שיעורים שאושרו מופיעים ללמידה.
      </p>
      {rows.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="אין נושאים עדיין" body="אפשר להוסיף תוכן מפאנל הניהול." />
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {rows.map((row) => (
            <li key={row.topic.id}>
              <TopicSummary
                topic={row.topic}
                completed={row.completed}
                total={row.total}
                subtopics={row.children}
              />
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
