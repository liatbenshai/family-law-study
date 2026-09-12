import { upsertLesson } from "@/app/actions/admin";
import { topicPathLabel } from "@/lib/topic-tree";
import type { Lesson, Topic } from "@/lib/types";

export function LessonForm({
  topics,
  lesson,
}: {
  topics: Topic[];
  lesson?: Lesson;
}) {
  const options = [...topics].sort((a, b) =>
    topicPathLabel(topics, a).localeCompare(topicPathLabel(topics, b), "he"),
  );

  return (
    <form action={upsertLesson} className="space-y-4">
      {lesson ? <input type="hidden" name="id" value={lesson.id} /> : null}
      <label className="block space-y-1 text-sm">
        <span>נושא</span>
        <select
          name="topicId"
          defaultValue={lesson?.topicId}
          required
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        >
          {options.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topicPathLabel(topics, topic)}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span>כותרת</span>
        <input
          name="title"
          required
          defaultValue={lesson?.title}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>פתיחה</span>
        <textarea
          name="intro"
          required
          rows={7}
          defaultValue={lesson?.intro}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>דקות משוערות (עד 15)</span>
        <input
          name="estimatedMinutes"
          type="number"
          min={1}
          max={15}
          required
          defaultValue={lesson?.estimatedMinutes ?? 10}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>מקורות</span>
        <textarea
          name="sources"
          required
          rows={4}
          defaultValue={lesson?.sources}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
      </label>
      <button type="submit" className="rounded-xl bg-accent px-5 py-3 text-card">
        {lesson ? "שמירת שיעור" : "יצירת טיוטה"}
      </button>
    </form>
  );
}
