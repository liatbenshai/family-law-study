import "server-only";

import { isDemoMode } from "@/lib/env";
import type { GradeQuality } from "@/lib/sm2";
import type { ContentStatus, Question } from "@/lib/types";
import * as demo from "./demo";
import * as supabaseDb from "./supabase";

function repo() {
  return isDemoMode() ? demo : supabaseDb;
}

export async function getProfile() {
  return repo().getProfile();
}

export async function getTopics() {
  return repo().getTopics();
}

export async function getTopicBySlug(slug: string) {
  return repo().getTopicBySlug(slug);
}

export async function getLessonsForTopic(
  topicId: string,
  includeUnpublished: boolean,
  includeDescendants = false,
) {
  return repo().getLessonsForTopic(topicId, includeUnpublished, includeDescendants);
}

export async function getLesson(id: string, includeUnpublished: boolean) {
  return repo().getLesson(id, includeUnpublished);
}

export async function getQuestions(lessonId: string) {
  return repo().getQuestions(lessonId);
}

export async function getQuestion(id: string) {
  return repo().getQuestion(id);
}

export async function getCaseForLesson(lessonId: string, includeUnpublished: boolean) {
  return repo().getCaseForLesson(lessonId, includeUnpublished);
}

export async function getProgress(userId: string) {
  return repo().getProgress(userId);
}

export async function getDueReviews(userId: string) {
  return repo().getDueReviews(userId);
}

export async function getAllLessons() {
  return repo().getAllLessons();
}

export async function getAllCases() {
  return repo().getAllCases();
}

export async function markLessonVisited(userId: string, lessonId: string) {
  return repo().markLessonVisited(userId, lessonId);
}

export async function completeLesson(userId: string, lessonId: string) {
  return repo().completeLesson(userId, lessonId);
}

export async function recordAttempt(input: {
  userId: string;
  questionId: string;
  selectedOptionId: string;
}) {
  return repo().recordAttempt(input);
}

export async function gradeReview(input: {
  userId: string;
  questionId: string;
  quality: GradeQuality;
}) {
  return repo().gradeReview(input);
}

export async function saveLesson(input: {
  id?: string;
  topicId: string;
  title: string;
  intro: string;
  estimatedMinutes: number;
  sources: string;
}) {
  return repo().saveLesson(input);
}

export async function setLessonStatus(id: string, status: ContentStatus) {
  return repo().setLessonStatus(id, status);
}

export async function saveQuestion(input: {
  id?: string;
  lessonId: string;
  prompt: string;
  options: Question["options"];
  correctOptionId: string;
  explanation: string;
}) {
  return repo().saveQuestion(input);
}

export async function saveCase(input: {
  id?: string;
  lessonId: string;
  title: string;
  facts: string;
  question: string;
  discussion: string;
  sources: string;
}) {
  return repo().saveCase(input);
}
