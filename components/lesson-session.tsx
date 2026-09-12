"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { finishLesson, submitAnswer, submitGrade } from "@/app/actions/learning";
import { GradeButtons } from "@/components/grade-buttons";
import { SourcesList } from "@/components/sources-list";
import type { GradeQuality } from "@/lib/sm2";
import type { CaseStudy, Lesson, Question } from "@/lib/types";

type Step = "intro" | "question" | "case" | "done";

export function LessonSession({
  lesson,
  questions,
  caseStudy,
}: {
  lesson: Lesson;
  questions: Question[];
  caseStudy: CaseStudy | null;
}) {
  const [step, setStep] = useState<Step>("intro");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [pending, startTransition] = useTransition();

  const question = questions[index];

  function start() {
    if (questions.length === 0) {
      setStep(caseStudy ? "case" : "done");
      return;
    }
    setStep("question");
  }

  function choose(optionId: string) {
    if (revealed || pending || !question) return;
    setSelected(optionId);
    startTransition(async () => {
      const result = await submitAnswer(question.id, optionId);
      setIsCorrect(result.isCorrect);
      setRevealed(true);
    });
  }

  function grade(quality: GradeQuality) {
    if (!question) return;
    startTransition(async () => {
      await submitGrade(question.id, quality);
      const nextIndex = index + 1;
      setSelected(null);
      setRevealed(false);
      setIsCorrect(null);
      if (nextIndex < questions.length) {
        setIndex(nextIndex);
      } else {
        setStep(caseStudy ? "case" : "done");
      }
    });
  }

  function complete() {
    startTransition(async () => {
      await finishLesson(lesson.id);
      setStep("done");
    });
  }

  if (step === "intro") {
    return (
      <article className="space-y-6">
        <p className="text-sm text-muted">עד {lesson.estimatedMinutes} דקות</p>
        <h1 className="text-3xl font-semibold leading-snug">{lesson.title}</h1>
        <p className="whitespace-pre-wrap text-lg leading-8">{lesson.intro}</p>
        <SourcesList sources={lesson.sources} />
        <button
          type="button"
          onClick={start}
          className="rounded-xl bg-accent px-5 py-3 text-card hover:opacity-90"
        >
          התחילי בשאלה
        </button>
      </article>
    );
  }

  if (step === "question" && question) {
    return (
      <article className="space-y-6">
        <p className="text-sm text-muted">
          שאלה {index + 1} מתוך {questions.length}
        </p>
        <h1 className="text-2xl font-semibold leading-snug">{question.prompt}</h1>
        <ul className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selected === option.id;
            const isAnswer = revealed && option.id === question.correctOptionId;
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
            <p className="text-lg font-medium">
              {isCorrect ? "נכון." : "לא מדויק. קראי את ההסבר ואז דרגי את הקושי."}
            </p>
            <p className="whitespace-pre-wrap leading-7">{question.explanation}</p>
            <SourcesList sources={lesson.sources} />
            <p className="text-sm text-muted">כמה קל היה לזכור את זה?</p>
            <GradeButtons onGrade={grade} disabled={pending} />
          </div>
        ) : null}
      </article>
    );
  }

  if (step === "case" && caseStudy) {
    return (
      <article className="space-y-6">
        <p className="text-sm text-muted">מקרה לתרגול</p>
        <h1 className="text-2xl font-semibold leading-snug">{caseStudy.title}</h1>
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-2 font-medium">העובדות</h2>
          <p className="whitespace-pre-wrap leading-7">{caseStudy.facts}</p>
        </section>
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-2 font-medium">שאלה למחשבה</h2>
          <p className="leading-7">{caseStudy.question}</p>
        </section>
        <details className="rounded-2xl border border-border bg-card p-5">
          <summary className="cursor-pointer font-medium">הסבר אחרי ניסיון</summary>
          <p className="mt-3 whitespace-pre-wrap leading-7">{caseStudy.discussion}</p>
        </details>
        <SourcesList sources={caseStudy.sources} />
        <button
          type="button"
          onClick={complete}
          disabled={pending}
          className="rounded-xl bg-accent px-5 py-3 text-card hover:opacity-90 disabled:opacity-50"
        >
          סיימתי את השיעור
        </button>
      </article>
    );
  }

  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-semibold">כל הכבוד</h1>
      <p className="leading-7 text-muted">
        השיעור נשמר. הכרטיסים ייכנסו לחזרה מרווחת לפי רמת הקושי שציינת.
      </p>
      <Link href="/" className="inline-block text-accent">
        חזרה לבית
      </Link>
    </article>
  );
}
