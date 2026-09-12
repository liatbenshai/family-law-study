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

  await markLessonVisited(user.id, lesson.id);
  const [questions, caseStudy] = await Promise.all([
    getQuestions(lesson.id),
    getCaseForLesson(lesson.id, user.isAdmin),
  ]);

  return (
    <AppShell user={user}>
      <LessonSession
        lesson={lesson}
        questions={questions}
        caseStudy={caseStudy?.status === "published" || user.isAdmin ? caseStudy : null}
      />
    </AppShell>
  );
}
