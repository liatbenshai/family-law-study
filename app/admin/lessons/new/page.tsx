import { AppShell } from "@/components/app-shell";
import { LessonForm } from "@/components/lesson-form";
import { requireAdmin } from "@/lib/auth";
import { getTopics } from "@/lib/db";

export default async function NewLessonPage() {
  const user = await requireAdmin();
  const topics = await getTopics();

  return (
    <AppShell user={user}>
      <h1 className="mb-6 text-3xl font-semibold">שיעור חדש</h1>
      <p className="mb-6 text-sm text-muted">השיעור יישמר כטיוטה עד לאישור ידני.</p>
      <LessonForm topics={topics} />
    </AppShell>
  );
}
