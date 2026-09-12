import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import type { Lesson } from "@/lib/types";

export function LessonCard({
  lesson,
  href,
  completed,
  showStatus = false,
}: {
  lesson: Lesson;
  href: string;
  completed?: boolean;
  showStatus?: boolean;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-medium">{lesson.title}</h3>
        {showStatus ? <StatusBadge status={lesson.status} /> : null}
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{lesson.intro}</p>
      <div className="mt-4 flex items-center gap-3 text-sm text-muted">
        <span>עד {lesson.estimatedMinutes} דקות</span>
        {completed ? <span className="text-accent">הושלם</span> : null}
      </div>
    </Link>
  );
}
