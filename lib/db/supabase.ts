import { getAdminEmail } from "@/lib/env";
import { applySm2, type GradeQuality } from "@/lib/sm2";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  CaseStudy,
  ContentStatus,
  DueReview,
  Lesson,
  LessonProgress,
  Profile,
  Question,
  QuestionOption,
  ReviewCard,
  Topic,
} from "@/lib/types";

function mapTopic(row: {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
}): Topic {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

function mapLesson(row: {
  id: string;
  topic_id: string;
  title: string;
  intro: string;
  estimated_minutes: number;
  sources: string;
  status: ContentStatus;
  sort_order: number;
}): Lesson {
  return {
    id: row.id,
    topicId: row.topic_id,
    title: row.title,
    intro: row.intro,
    estimatedMinutes: row.estimated_minutes,
    sources: row.sources,
    status: row.status,
    sortOrder: row.sort_order,
  };
}

function mapQuestion(row: {
  id: string;
  lesson_id: string;
  prompt: string;
  options: QuestionOption[];
  correct_option_id: string;
  explanation: string;
  sort_order: number;
}): Question {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    prompt: row.prompt,
    options: row.options,
    correctOptionId: row.correct_option_id,
    explanation: row.explanation,
    sortOrder: row.sort_order,
  };
}

function mapCase(row: {
  id: string;
  lesson_id: string;
  title: string;
  facts: string;
  question: string;
  discussion: string;
  sources: string;
  status: ContentStatus;
}): CaseStudy {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    title: row.title,
    facts: row.facts,
    question: row.question,
    discussion: row.discussion,
    sources: row.sources,
    status: row.status,
  };
}

function mapReview(row: {
  id: string;
  user_id: string;
  question_id: string;
  easiness: number;
  interval_days: number;
  repetitions: number;
  next_review_at: string;
  last_reviewed_at: string | null;
}): ReviewCard {
  return {
    id: row.id,
    userId: row.user_id,
    questionId: row.question_id,
    easiness: Number(row.easiness),
    intervalDays: row.interval_days,
    repetitions: row.repetitions,
    nextReviewAt: row.next_review_at,
    lastReviewedAt: row.last_reviewed_at,
  };
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, is_admin")
    .eq("id", user.id)
    .maybeSingle();

  const adminEmail = getAdminEmail();
  const isAdmin =
    Boolean(data?.is_admin) ||
    (adminEmail !== null && user.email?.toLowerCase() === adminEmail);

  return {
    id: user.id,
    displayName: data?.display_name ?? user.user_metadata?.display_name ?? null,
    email: user.email ?? null,
    isAdmin,
  };
}

export async function getTopics(): Promise<Topic[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("topics")
    .select("id, slug, title, description, sort_order")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map(mapTopic);
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("topics")
    .select("id, slug, title, description, sort_order")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapTopic(data) : null;
}

export async function getLessonsForTopic(
  topicId: string,
  includeUnpublished: boolean,
): Promise<Lesson[]> {
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("lessons")
    .select(
      "id, topic_id, title, intro, estimated_minutes, sources, status, sort_order",
    )
    .eq("topic_id", topicId)
    .order("sort_order");
  if (!includeUnpublished) {
    query = query.eq("status", "published");
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapLesson);
}

export async function getLesson(
  id: string,
  includeUnpublished: boolean,
): Promise<Lesson | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .select(
      "id, topic_id, title, intro, estimated_minutes, sources, status, sort_order",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const lesson = mapLesson(data);
  if (!includeUnpublished && lesson.status !== "published") return null;
  return lesson;
}

export async function getQuestions(lessonId: string): Promise<Question[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, lesson_id, prompt, options, correct_option_id, explanation, sort_order",
    )
    .eq("lesson_id", lessonId)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map(mapQuestion);
}

export async function getQuestion(id: string): Promise<Question | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id, lesson_id, prompt, options, correct_option_id, explanation, sort_order",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapQuestion(data) : null;
}

export async function getCaseForLesson(
  lessonId: string,
  includeUnpublished: boolean,
): Promise<CaseStudy | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cases")
    .select("id, lesson_id, title, facts, question, discussion, sources, status")
    .eq("lesson_id", lessonId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const caseStudy = mapCase(data);
  if (!includeUnpublished && caseStudy.status !== "published") return null;
  return caseStudy;
}

export async function getProgress(userId: string): Promise<LessonProgress[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("user_id, lesson_id, completed_at, last_visited_at")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    userId: row.user_id,
    lessonId: row.lesson_id,
    completedAt: row.completed_at,
    lastVisitedAt: row.last_visited_at,
  }));
}

export async function getDueReviews(userId: string): Promise<DueReview[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("review_cards")
    .select(
      "id, user_id, question_id, easiness, interval_days, repetitions, next_review_at, last_reviewed_at",
    )
    .eq("user_id", userId)
    .lte("next_review_at", new Date().toISOString())
    .order("next_review_at");
  if (error) throw error;

  const cards = (data ?? []).map(mapReview);
  const due: DueReview[] = [];
  for (const card of cards) {
    const question = await getQuestion(card.questionId);
    if (!question) continue;
    const lesson = await getLesson(question.lessonId, false);
    if (!lesson) continue;
    due.push({ card, question, lessonTitle: lesson.title });
  }
  return due;
}

export async function getAllLessons(): Promise<Lesson[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .select(
      "id, topic_id, title, intro, estimated_minutes, sources, status, sort_order",
    )
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map(mapLesson);
}

export async function getAllCases(): Promise<CaseStudy[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("cases")
    .select("id, lesson_id, title, facts, question, discussion, sources, status");
  if (error) throw error;
  return (data ?? []).map(mapCase);
}

export async function markLessonVisited(userId: string, lessonId: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("lesson_progress").upsert({
    user_id: userId,
    lesson_id: lessonId,
    last_visited_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function completeLesson(userId: string, lessonId: string) {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from("lesson_progress").upsert({
    user_id: userId,
    lesson_id: lessonId,
    completed_at: now,
    last_visited_at: now,
  });
  if (error) throw error;
}

export async function recordAttempt(input: {
  userId: string;
  questionId: string;
  selectedOptionId: string;
}): Promise<{ isCorrect: boolean; question: Question }> {
  const question = await getQuestion(input.questionId);
  if (!question) throw new Error("השאלה לא נמצאה");
  const isCorrect = question.correctOptionId === input.selectedOptionId;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("attempts").insert({
    user_id: input.userId,
    question_id: input.questionId,
    selected_option_id: input.selectedOptionId,
    is_correct: isCorrect,
  });
  if (error) throw error;
  return { isCorrect, question };
}

export async function gradeReview(input: {
  userId: string;
  questionId: string;
  quality: GradeQuality;
}): Promise<ReviewCard> {
  const supabase = await createServerSupabaseClient();
  const { data: existing } = await supabase
    .from("review_cards")
    .select(
      "id, user_id, question_id, easiness, interval_days, repetitions, next_review_at, last_reviewed_at",
    )
    .eq("user_id", input.userId)
    .eq("question_id", input.questionId)
    .maybeSingle();

  const now = new Date();
  const scheduled = applySm2(
    existing
      ? {
          easiness: Number(existing.easiness),
          intervalDays: existing.interval_days,
          repetitions: existing.repetitions,
        }
      : { easiness: 2.5, intervalDays: 0, repetitions: 0 },
    input.quality,
    now,
  );

  const payload = {
    user_id: input.userId,
    question_id: input.questionId,
    easiness: scheduled.easiness,
    interval_days: scheduled.intervalDays,
    repetitions: scheduled.repetitions,
    next_review_at: scheduled.nextReviewAt.toISOString(),
    last_reviewed_at: now.toISOString(),
  };

  const { data, error } = await supabase
    .from("review_cards")
    .upsert(payload, { onConflict: "user_id,question_id" })
    .select(
      "id, user_id, question_id, easiness, interval_days, repetitions, next_review_at, last_reviewed_at",
    )
    .single();
  if (error) throw error;
  return mapReview(data);
}

export async function saveLesson(input: {
  id?: string;
  topicId: string;
  title: string;
  intro: string;
  estimatedMinutes: number;
  sources: string;
}): Promise<Lesson> {
  if (input.estimatedMinutes < 1 || input.estimatedMinutes > 15) {
    throw new Error("שיעור צריך להיות בין דקה ל-15 דקות");
  }
  const supabase = await createServerSupabaseClient();
  if (input.id) {
    const { data, error } = await supabase
      .from("lessons")
      .update({
        topic_id: input.topicId,
        title: input.title,
        intro: input.intro,
        estimated_minutes: input.estimatedMinutes,
        sources: input.sources,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id)
      .select(
        "id, topic_id, title, intro, estimated_minutes, sources, status, sort_order",
      )
      .single();
    if (error) throw error;
    return mapLesson(data);
  }

  const { count } = await supabase
    .from("lessons")
    .select("id", { count: "exact", head: true })
    .eq("topic_id", input.topicId);

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      topic_id: input.topicId,
      title: input.title,
      intro: input.intro,
      estimated_minutes: input.estimatedMinutes,
      sources: input.sources,
      status: "draft",
      sort_order: (count ?? 0) + 1,
    })
    .select(
      "id, topic_id, title, intro, estimated_minutes, sources, status, sort_order",
    )
    .single();
  if (error) throw error;
  return mapLesson(data);
}

export async function setLessonStatus(id: string, status: ContentStatus): Promise<Lesson> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lessons")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(
      "id, topic_id, title, intro, estimated_minutes, sources, status, sort_order",
    )
    .single();
  if (error) throw error;

  if (status === "published" || status === "draft") {
    await supabase.from("cases").update({ status }).eq("lesson_id", id);
  }
  return mapLesson(data);
}

export async function saveQuestion(input: {
  id?: string;
  lessonId: string;
  prompt: string;
  options: Question["options"];
  correctOptionId: string;
  explanation: string;
}): Promise<Question> {
  const supabase = await createServerSupabaseClient();
  if (input.id) {
    const { data, error } = await supabase
      .from("questions")
      .update({
        prompt: input.prompt,
        options: input.options,
        correct_option_id: input.correctOptionId,
        explanation: input.explanation,
      })
      .eq("id", input.id)
      .select(
        "id, lesson_id, prompt, options, correct_option_id, explanation, sort_order",
      )
      .single();
    if (error) throw error;
    return mapQuestion(data);
  }

  const { count } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("lesson_id", input.lessonId);

  const { data, error } = await supabase
    .from("questions")
    .insert({
      lesson_id: input.lessonId,
      prompt: input.prompt,
      options: input.options,
      correct_option_id: input.correctOptionId,
      explanation: input.explanation,
      sort_order: (count ?? 0) + 1,
    })
    .select(
      "id, lesson_id, prompt, options, correct_option_id, explanation, sort_order",
    )
    .single();
  if (error) throw error;
  return mapQuestion(data);
}

export async function saveCase(input: {
  id?: string;
  lessonId: string;
  title: string;
  facts: string;
  question: string;
  discussion: string;
  sources: string;
}): Promise<CaseStudy> {
  const supabase = await createServerSupabaseClient();
  if (input.id) {
    const { data, error } = await supabase
      .from("cases")
      .update({
        title: input.title,
        facts: input.facts,
        question: input.question,
        discussion: input.discussion,
        sources: input.sources,
      })
      .eq("id", input.id)
      .select("id, lesson_id, title, facts, question, discussion, sources, status")
      .single();
    if (error) throw error;
    return mapCase(data);
  }

  const { data, error } = await supabase
    .from("cases")
    .insert({
      lesson_id: input.lessonId,
      title: input.title,
      facts: input.facts,
      question: input.question,
      discussion: input.discussion,
      sources: input.sources,
      status: "draft",
    })
    .select("id, lesson_id, title, facts, question, discussion, sources, status")
    .single();
  if (error) throw error;
  return mapCase(data);
}
