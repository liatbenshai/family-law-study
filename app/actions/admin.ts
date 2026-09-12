"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { canPublish, canSendToReview, canUnpublish } from "@/lib/content-status";
import {
  getLesson,
  saveCase,
  saveLesson,
  saveQuestion,
  setLessonStatus,
} from "@/lib/db";
import type { ContentStatus, QuestionOption } from "@/lib/types";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertLesson(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id") || undefined;
  const estimatedMinutes = Number(formData.get("estimatedMinutes"));
  const lesson = await saveLesson({
    id,
    topicId: text(formData, "topicId"),
    title: text(formData, "title"),
    intro: text(formData, "intro"),
    estimatedMinutes,
    sources: text(formData, "sources"),
  });
  revalidatePath("/admin");
  revalidatePath(`/admin/lessons/${lesson.id}`);
  redirect(`/admin/lessons/${lesson.id}`);
}

export async function changeLessonStatus(
  lessonId: string,
  nextStatus: ContentStatus,
  confirmation?: { confirmLesson?: boolean; confirmCase?: boolean },
) {
  await requireAdmin();
  const lesson = await getLesson(lessonId, true);
  if (!lesson) {
    throw new Error("השיעור לא נמצא");
  }

  if (nextStatus === "review" && !canSendToReview(lesson.status)) {
    throw new Error("אפשר לשלוח לבדיקה רק מטיוטה.");
  }
  if (nextStatus === "published") {
    if (!canPublish(lesson.status)) {
      throw new Error("אפשר לפרסם רק תוכן שעבר לבדיקה.");
    }
    if (!confirmation?.confirmLesson || !confirmation.confirmCase) {
      throw new Error("יש לאשר ידנית את השיעור ואת המקרה לפני פרסום.");
    }
  }
  if (nextStatus === "draft" && !canUnpublish(lesson.status) && lesson.status !== "review") {
    throw new Error("לא ניתן להחזיר את השיעור לטיוטה.");
  }

  await setLessonStatus(lessonId, nextStatus);
  revalidatePath("/admin");
  revalidatePath(`/admin/lessons/${lessonId}`);
  revalidatePath("/");
  revalidatePath("/topics");
}

export async function upsertQuestion(formData: FormData) {
  await requireAdmin();
  const options: QuestionOption[] = [
    { id: "a", text: text(formData, "optionA") },
    { id: "b", text: text(formData, "optionB") },
    { id: "c", text: text(formData, "optionC") },
    { id: "d", text: text(formData, "optionD") },
  ].filter((option) => option.text.length > 0);

  const question = await saveQuestion({
    id: text(formData, "id") || undefined,
    lessonId: text(formData, "lessonId"),
    prompt: text(formData, "prompt"),
    options,
    correctOptionId: text(formData, "correctOptionId"),
    explanation: text(formData, "explanation"),
  });
  revalidatePath(`/admin/lessons/${question.lessonId}`);
}

export async function upsertCase(formData: FormData) {
  await requireAdmin();
  const lessonId = text(formData, "lessonId");
  await saveCase({
    id: text(formData, "id") || undefined,
    lessonId,
    title: text(formData, "title"),
    facts: text(formData, "facts"),
    question: text(formData, "question"),
    discussion: text(formData, "discussion"),
    sources: text(formData, "sources"),
  });
  revalidatePath(`/admin/lessons/${lessonId}`);
}
