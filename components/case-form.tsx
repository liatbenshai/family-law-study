import { upsertCase } from "@/app/actions/admin";
import type { CaseStudy } from "@/lib/types";

export function CaseForm({
  lessonId,
  caseStudy,
}: {
  lessonId: string;
  caseStudy?: CaseStudy | null;
}) {
  return (
    <form action={upsertCase} className="space-y-3">
      {caseStudy ? <input type="hidden" name="id" value={caseStudy.id} /> : null}
      <input type="hidden" name="lessonId" value={lessonId} />
      <label className="block space-y-1 text-sm">
        <span>כותרת המקרה</span>
        <input
          name="title"
          required
          defaultValue={caseStudy?.title}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>עובדות</span>
        <textarea
          name="facts"
          required
          rows={5}
          defaultValue={caseStudy?.facts}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>שאלה למחשבה</span>
        <textarea
          name="question"
          required
          rows={3}
          defaultValue={caseStudy?.question}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>דיון אחרי ניסיון</span>
        <textarea
          name="discussion"
          required
          rows={5}
          defaultValue={caseStudy?.discussion}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
      </label>
      <label className="block space-y-1 text-sm">
        <span>מקורות המקרה</span>
        <textarea
          name="sources"
          required
          rows={3}
          defaultValue={caseStudy?.sources}
          className="w-full rounded-xl border border-border bg-card px-3 py-2"
        />
      </label>
      <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-card">
        שמירת מקרה
      </button>
    </form>
  );
}
