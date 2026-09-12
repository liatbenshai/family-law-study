"use client";

import { GRADE_LABELS, type GradeQuality } from "@/lib/sm2";

const order: GradeQuality[] = [1, 3, 4, 5];

export function GradeButtons({
  onGrade,
  disabled,
}: {
  onGrade: (quality: GradeQuality) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {order.map((quality) => (
        <button
          key={quality}
          type="button"
          disabled={disabled}
          onClick={() => onGrade(quality)}
          className="rounded-xl border border-border bg-card py-3 text-sm hover:border-accent disabled:opacity-50"
        >
          {GRADE_LABELS[quality]}
        </button>
      ))}
    </div>
  );
}
