import type { ContentStatus } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/content-status";

const styles: Record<ContentStatus, string> = {
  draft: "bg-border text-foreground",
  review: "bg-amber-100 text-warning",
  published: "bg-accent-soft text-accent",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
