"use client";

import { useTransition } from "react";
import { changeLessonStatus } from "@/app/actions/admin";
import { canPublish, canSendToReview, canUnpublish } from "@/lib/content-status";
import type { ContentStatus } from "@/lib/types";

export function PublishControls({
  lessonId,
  status,
}: {
  lessonId: string;
  status: ContentStatus;
}) {
  const [pending, startTransition] = useTransition();

  function run(next: ContentStatus, confirmation?: { confirmLesson: boolean; confirmCase: boolean }) {
    startTransition(async () => {
      await changeLessonStatus(lessonId, next, confirmation);
    });
  }

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <h2 className="font-medium">אישור ופרסום</h2>
      <p className="text-sm leading-6 text-muted">
        תוכן חדש נשמר כטיוטה. רק אחרי מעבר לבדיקה ואישור ידני אפשר לפרסם ללמידה.
      </p>
      {canSendToReview(status) ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run("review")}
          className="rounded-xl border border-border px-4 py-2 hover:border-accent disabled:opacity-50"
        >
          שליחה לבדיקה
        </button>
      ) : null}
      {canPublish(status) ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const confirmLesson = (form.elements.namedItem("confirmLesson") as HTMLInputElement).checked;
            const confirmCase = (form.elements.namedItem("confirmCase") as HTMLInputElement).checked;
            run("published", { confirmLesson, confirmCase });
          }}
          className="space-y-3"
        >
          <label className="flex items-start gap-2 text-sm">
            <input name="confirmLesson" type="checkbox" required className="mt-1" />
            קראתי את השיעור והמקורות, ואני מאשרת פרסום.
          </label>
          <label className="flex items-start gap-2 text-sm">
            <input name="confirmCase" type="checkbox" required className="mt-1" />
            קראתי את המקרה הנלווה, ואני מאשרת פרסום.
          </label>
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-accent px-4 py-2 text-card disabled:opacity-50"
          >
            פרסום ללמידה
          </button>
        </form>
      ) : null}
      {canUnpublish(status) || status === "review" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run("draft")}
          className="rounded-xl border border-border px-4 py-2 text-sm text-muted hover:text-foreground disabled:opacity-50"
        >
          החזרה לטיוטה
        </button>
      ) : null}
    </section>
  );
}
