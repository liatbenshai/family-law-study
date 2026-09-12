import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { LessonSession } from "@/components/lesson-session";
import { requireUser } from "@/lib/auth";
import { getCaseForLesson, getLesson, getQuestions, markLessonVisited } from "@/lib/db";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const lesson = await getLesson(id, user.isAdmin);
  if (!lesson) notFound();
  if (lesson.status !== "published" && !user.isAdmin) notFound();

  const isPreview = lesson.status !== "published";

  await markLessonVisited(user.id, lesson.id);
  const [questions, caseStudy] = await Promise.all([
    getQuestions(lesson.id),
    getCaseForLesson(lesson.id, user.isAdmin),
  ]);

  return (
    <AppShell user={user}>
      {isPreview ? (
        <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2 text-sm text-warning">
          תצוגה מקדימה. השיעור עדיין לא מפורסם ללמידה.
        </p>
      ) : null}
      <LessonSession
        lesson={lesson}
        questions={questions}
        caseStudy={caseStudy?.status === "published" || user.isAdmin ? caseStudy : null}
      />
    </AppShell>
  );
}
