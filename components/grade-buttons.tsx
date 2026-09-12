"use client";

import { GRADE_LABELS, type GradeQuality } from "@/lib/sm2";

const order: GradeQuality[] = [1, 3, 4, 5];

const styles: Record<GradeQuality, string> = {
  1: "border-danger text-danger hover:bg-red-50",
  3: "border-warning text-warning hover:bg-amber-50",
  4: "border-border hover:border-accent",
  5: "border-accent text-accent hover:bg-accent-soft",
};

export function GradeButtons({
  onGrade,
  disabled,
}: {
  onGrade: (quality: GradeQuality) => void;
  disabled?: boolean;
}) {
  return (
    <div dir="ltr" className="grid grid-cols-4 gap-2">
      {order.map((quality) => (
        <button
          key={quality}
          type="button"
          disabled={disabled}
          onClick={() => onGrade(quality)}
          className={`rounded-xl border bg-card py-3 text-sm disabled:opacity-50 ${styles[quality]}`}
        >
          {GRADE_LABELS[quality]}
        </button>
      ))}
    </div>
  );
}
