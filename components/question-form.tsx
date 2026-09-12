import { upsertQuestion } from "@/app/actions/admin";
import type { Question } from "@/lib/types";

export function QuestionForm({
  lessonId,
  question,
}: {
  lessonId: string;
  question?: Question;
}) {
  const optionA = question?.options.find((option) => option.id === "a")?.text ?? "";
  const optionB = question?.options.find((option) => option.id === "b")?.text ?? "";
  const optionC = question?.options.find((option) => option.id === "c")?.text ?? "";
  const optionD = question?.options.find((option) => option.id === "d")?.text ?? "";

  return (
    <form action={upsertQuestion} className="space-y-3 rounded-2xl border border-border bg-card p-4">
      {question ? <input type="hidden" name="id" value={question.id} /> : null}
      <input type="hidden" name="lessonId" value={lessonId} />
      <label className="block space-y-1 text-sm">
        <span>שאלה</span>
        <textarea
          name="prompt"
          required
          rows={3}
          defaultValue={question?.prompt}
          className="w-full rounded-xl border border-border bg-background px-3 py-2"
        />
      </label>
      {(
        [
          ["A", optionA],
          ["B", optionB],
          ["C", optionC],
          ["D", optionD],
        ] as const
      ).map(([letter, value]) => (
        <label key={letter} className="block space-y-1 text-sm">
          <span>אפשרות {letter}</span>
          <input
            name={`option${letter}`}
            required={letter === "A" || letter === "B"}
            defaultValue={value}
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
          />
        </label>
      ))}
      <label className="block space-y-1 text-sm">
        <span>התשובה הנכונה</span>
        <select
          name="correctOptionId"
          defaultValue={question?.correctOptionId ?? "a"}
          className="w-full rounded-xl border border-border bg-background px-3 py-2"
        >
          <option value="a">A</option>
          <option value="b">B</option>
          <option value="c">C</option>
          <option value="d">D</option>
        </select>
      </label>
      <label className="block space-y-1 text-sm">
        <span>הסבר אחרי הניסיון</span>
        <textarea
          name="explanation"
          required
          rows={4}
          defaultValue={question?.explanation}
          className="w-full rounded-xl border border-border bg-background px-3 py-2"
        />
      </label>
      <button type="submit" className="rounded-xl border border-border px-4 py-2">
        {question ? "שמירת שאלה" : "הוספת שאלה"}
      </button>
    </form>
  );
}
