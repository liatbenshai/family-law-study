"use client";

import { useState, useTransition } from "react";
import { submitAnswer, submitGrade } from "@/app/actions/learning";
import { GradeButtons } from "@/components/grade-buttons";
import { EmptyState } from "@/components/empty-state";
import type { GradeQuality } from "@/lib/sm2";
import type { DueReview } from "@/lib/types";

export function ReviewSession({ items }: { items: DueReview[] }) {
  const [queue, setQueue] = useState(items);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [pending, startTransition] = useTransition();

  const current = queue[0];

  if (!current) {
    return (
      <EmptyState
        title="אין כרטיסים להיום"
        body="כל הכרטיסים שתוזמנו לחזרה כבר טופלו. אפשר לחזור לשיעור חדש."
      />
    );
  }

  function choose(optionId: string) {
    if (revealed || pending) return;
    setSelected(optionId);
    startTransition(async () => {
      const result = await submitAnswer(current.question.id, optionId);
      setIsCorrect(result.isCorrect);
      setRevealed(true);
    });
  }

  function grade(quality: GradeQuality) {
    startTransition(async () => {
      await submitGrade(current.question.id, quality);
      setQueue((prev) => prev.slice(1));
      setSelected(null);
      setRevealed(false);
      setIsCorrect(null);
    });
  }

  return (
    <article className="space-y-6">
      <p className="text-sm text-muted">
        נותרו {queue.length} כרטיסים · {current.lessonTitle}
      </p>
      <h1 className="text-2xl font-semibold leading-snug">{current.question.prompt}</h1>
      <ul className="space-y-3">
        {current.question.options.map((option) => {
          const isSelected = selected === option.id;
          const isAnswer = revealed && option.id === current.question.correctOptionId;
          const isWrongPick = revealed && isSelected && !isCorrect;
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={revealed || pending}
                onClick={() => choose(option.id)}
                className={`w-full rounded-xl border px-4 py-3 text-right leading-6 ${
                  isAnswer
                    ? "border-accent bg-accent-soft"
                    : isWrongPick
                      ? "border-danger bg-red-50"
                      : "border-border bg-card hover:border-accent"
                }`}
              >
                {option.text}
              </button>
            </li>
          );
        })}
      </ul>
      {revealed ? (
        <div className="space-y-4">
          <p className="whitespace-pre-wrap leading-7">{current.question.explanation}</p>
          <GradeButtons onGrade={grade} disabled={pending} />
        </div>
      ) : null}
    </article>
  );
}
