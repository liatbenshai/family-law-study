"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { completeLesson, gradeReview, recordAttempt } from "@/lib/db";
import type { GradeQuality } from "@/lib/sm2";

export async function submitAnswer(questionId: string, selectedOptionId: string) {
  const user = await requireUser();
  const result = await recordAttempt({
    userId: user.id,
    questionId,
    selectedOptionId,
  });
  revalidatePath("/review");
  return {
    isCorrect: result.isCorrect,
    explanation: result.question.explanation,
    correctOptionId: result.question.correctOptionId,
  };
}

export async function submitGrade(questionId: string, quality: GradeQuality) {
  const user = await requireUser();
  await gradeReview({
    userId: user.id,
    questionId,
    quality,
  });
  revalidatePath("/review");
  revalidatePath("/");
}

export async function finishLesson(lessonId: string) {
  const user = await requireUser();
  await completeLesson(user.id, lessonId);
  revalidatePath("/");
  revalidatePath("/topics");
  revalidatePath(`/lessons/${lessonId}`);
}
