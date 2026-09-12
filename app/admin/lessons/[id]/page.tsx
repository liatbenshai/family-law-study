import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { CaseForm } from "@/components/case-form";
import { LessonForm } from "@/components/lesson-form";
import { PublishControls } from "@/components/publish-controls";
import { QuestionForm } from "@/components/question-form";
import { StatusBadge } from "@/components/status-badge";
import { requireAdmin } from "@/lib/auth";
import { getCaseForLesson, getLesson, getQuestions, getTopics } from "@/lib/db";

export default async function AdminLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAdmin();
  const lesson = await getLesson(id, true);
  if (!lesson) notFound();

  const [topics, questions, caseStudy] = await Promise.all([
    getTopics(),
    getQuestions(lesson.id),
    getCaseForLesson(lesson.id, true),
  ]);

  return (
    <AppShell user={user}>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-3xl font-semibold">עריכת שיעור</h1>
        <StatusBadge status={lesson.status} />
      </div>
      <div className="space-y-10">
        <LessonForm topics={topics} lesson={lesson} />
        <PublishControls lessonId={lesson.id} status={lesson.status} />
        <section className="space-y-4">
          <h2 className="text-xl font-medium">שאלות</h2>
          {questions.map((question) => (
            <QuestionForm key={question.id} lessonId={lesson.id} question={question} />
          ))}
          <QuestionForm lessonId={lesson.id} />
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-medium">מקרה</h2>
          <CaseForm lessonId={lesson.id} caseStudy={caseStudy} />
        </section>
      </div>
    </AppShell>
  );
}
