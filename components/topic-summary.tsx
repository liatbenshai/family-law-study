import Link from "next/link";
import type { Topic } from "@/lib/types";

export function TopicSummary({
  topic,
  completed,
  total,
  subtopics = [],
}: {
  topic: Topic;
  completed: number;
  total: number;
  subtopics?: { topic: Topic; completed: number; total: number }[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Link href={`/topics/${topic.slug}`} className="block hover:text-accent">
        <h2 className="text-xl font-medium">{topic.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{topic.description}</p>
        <p className="mt-3 text-sm text-muted">
          {completed} מתוך {total} שיעורים
        </p>
      </Link>
      {subtopics.length > 0 ? (
        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {subtopics.map((child) => (
            <li key={child.topic.id}>
              <Link
                href={`/topics/${child.topic.slug}`}
                className="flex items-baseline justify-between gap-3 text-sm hover:text-accent"
              >
                <span>{child.topic.title}</span>
                <span className="text-muted">
                  {child.completed}/{child.total}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
