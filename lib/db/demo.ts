import fs from "node:fs";
import path from "node:path";
import { cases, DEMO_USER_ID, lessons, questions, topics } from "@/data/seed";
import { applySm2, type GradeQuality } from "@/lib/sm2";
import { topicSubtreeIds } from "@/lib/topic-tree";
import type {
  Attempt,
  CaseStudy,
  ContentStatus,
  DueReview,
  Lesson,
  LessonProgress,
  Profile,
  Question,
  ReviewCard,
  Topic,
} from "@/lib/types";

const STATE_PATH = path.join(process.cwd(), "data", ".demo-state.json");

type DemoState = {
  profile: Profile;
  lessons: Lesson[];
  questions: Question[];
  cases: CaseStudy[];
  progress: LessonProgress[];
  reviews: ReviewCard[];
  attempts: Attempt[];
};

function mergeById<T extends { id: string }>(seed: T[], saved: T[] | undefined): T[] {
  const savedItems = saved ?? [];
  const seedIds = new Set(seed.map((item) => item.id));
  const extras = savedItems.filter((item) => !seedIds.has(item.id));
  return structuredClone([...seed, ...extras]);
}

function defaultState(): DemoState {
  return {
    profile: {
      id: DEMO_USER_ID,
      displayName: "ליאת",
      email: "demo@local",
      isAdmin: true,
    },
    lessons: structuredClone(lessons),
    questions: structuredClone(questions),
    cases: structuredClone(cases),
    progress: [],
    reviews: [],
    attempts: [],
  };
}

function readState(): DemoState {
  try {
    const raw = fs.readFileSync(STATE_PATH, "utf8");
    const parsed = JSON.parse(raw) as DemoState;
    const defaults = defaultState();
    return {
      ...defaults,
      ...parsed,
      profile: { ...defaults.profile, ...parsed.profile },
      lessons: mergeById(defaults.lessons, parsed.lessons),
      questions: mergeById(defaults.questions, parsed.questions),
      cases: mergeById(defaults.cases, parsed.cases),
    };
  } catch {
    return defaultState();
  }
}

function writeState(state: DemoState) {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), "utf8");
}

function mutate<T>(fn: (state: DemoState) => T): T {
  const state = readState();
  const result = fn(state);
  writeState(state);
  return result;
}

export async function getProfile(): Promise<Profile | null> {
  return readState().profile;
}

export async function getTopics(): Promise<Topic[]> {
  return structuredClone(topics).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  return topics.find((topic) => topic.slug === slug) ?? null;
}

export async function getLessonsForTopic(
  topicId: string,
  includeUnpublished: boolean,
  includeDescendants = false,
): Promise<Lesson[]> {
  const state = readState();
  const topicIds = includeDescendants ? topicSubtreeIds(topics, topicId) : [topicId];
  return state.lessons
    .filter(
      (lesson) =>
        topicIds.includes(lesson.topicId) &&
        (includeUnpublished || lesson.status === "published"),
    )
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getLesson(
  id: string,
  includeUnpublished: boolean,
): Promise<Lesson | null> {
  const lesson = readState().lessons.find((item) => item.id === id) ?? null;
  if (!lesson) return null;
  if (!includeUnpublished && lesson.status !== "published") return null;
  return lesson;
}

export async function getQuestions(lessonId: string): Promise<Question[]> {
  return readState()
    .questions.filter((question) => question.lessonId === lessonId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getQuestion(id: string): Promise<Question | null> {
  return readState().questions.find((question) => question.id === id) ?? null;
}

export async function getCaseForLesson(
  lessonId: string,
  includeUnpublished: boolean,
): Promise<CaseStudy | null> {
  const caseStudy =
    readState().cases.find((item) => item.lessonId === lessonId) ?? null;
  if (!caseStudy) return null;
  if (!includeUnpublished && caseStudy.status !== "published") return null;
  return caseStudy;
}

export async function getProgress(userId: string): Promise<LessonProgress[]> {
  return readState().progress.filter((item) => item.userId === userId);
}

export async function getDueReviews(userId: string): Promise<DueReview[]> {
  const state = readState();
  const now = Date.now();
  return state.reviews
    .filter(
      (card) => card.userId === userId && new Date(card.nextReviewAt).getTime() <= now,
    )
    .map((card) => {
      const question = state.questions.find((item) => item.id === card.questionId);
      const lesson = state.lessons.find((item) => item.id === question?.lessonId);
      if (!question || !lesson || lesson.status !== "published") return null;
      return { card, question, lessonTitle: lesson.title };
    })
    .filter((item): item is DueReview => item !== null)
    .sort((a, b) => a.card.nextReviewAt.localeCompare(b.card.nextReviewAt));
}

export async function getAllLessons(): Promise<Lesson[]> {
  return readState().lessons.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAllCases(): Promise<CaseStudy[]> {
  return readState().cases;
}

export async function markLessonVisited(userId: string, lessonId: string) {
  mutate((state) => {
    const existing = state.progress.find(
      (item) => item.userId === userId && item.lessonId === lessonId,
    );
    if (existing) {
      existing.lastVisitedAt = new Date().toISOString();
    } else {
      state.progress.push({
        userId,
        lessonId,
        completedAt: null,
        lastVisitedAt: new Date().toISOString(),
      });
    }
  });
}

export async function completeLesson(userId: string, lessonId: string) {
  mutate((state) => {
    const existing = state.progress.find(
      (item) => item.userId === userId && item.lessonId === lessonId,
    );
    const now = new Date().toISOString();
    if (existing) {
      existing.completedAt = now;
      existing.lastVisitedAt = now;
    } else {
      state.progress.push({
        userId,
        lessonId,
        completedAt: now,
        lastVisitedAt: now,
      });
    }
  });
}

export async function recordAttempt(input: {
  userId: string;
  questionId: string;
  selectedOptionId: string;
}): Promise<{ isCorrect: boolean; question: Question }> {
  return mutate((state) => {
    const question = state.questions.find((item) => item.id === input.questionId);
    if (!question) {
      throw new Error("השאלה לא נמצאה");
    }
    const isCorrect = question.correctOptionId === input.selectedOptionId;
    state.attempts.push({
      id: crypto.randomUUID(),
      userId: input.userId,
      questionId: input.questionId,
      selectedOptionId: input.selectedOptionId,
      isCorrect,
      createdAt: new Date().toISOString(),
    });
    return { isCorrect, question };
  });
}

export async function gradeReview(input: {
  userId: string;
  questionId: string;
  quality: GradeQuality;
}): Promise<ReviewCard> {
  return mutate((state) => {
    const existing = state.reviews.find(
      (card) => card.userId === input.userId && card.questionId === input.questionId,
    );
    const now = new Date();
    const scheduled = applySm2(
      existing ?? { easiness: 2.5, intervalDays: 0, repetitions: 0 },
      input.quality,
      now,
    );
    if (existing) {
      existing.easiness = scheduled.easiness;
      existing.intervalDays = scheduled.intervalDays;
      existing.repetitions = scheduled.repetitions;
      existing.nextReviewAt = scheduled.nextReviewAt.toISOString();
      existing.lastReviewedAt = now.toISOString();
      return existing;
    }
    const created: ReviewCard = {
      id: crypto.randomUUID(),
      userId: input.userId,
      questionId: input.questionId,
      easiness: scheduled.easiness,
      intervalDays: scheduled.intervalDays,
      repetitions: scheduled.repetitions,
      nextReviewAt: scheduled.nextReviewAt.toISOString(),
      lastReviewedAt: now.toISOString(),
    };
    state.reviews.push(created);
    return created;
  });
}

export async function saveLesson(input: {
  id?: string;
  topicId: string;
  title: string;
  intro: string;
  estimatedMinutes: number;
  sources: string;
  status?: ContentStatus;
}): Promise<Lesson> {
  return mutate((state) => {
    if (input.estimatedMinutes < 1 || input.estimatedMinutes > 15) {
      throw new Error("שיעור צריך להיות בין דקה ל-15 דקות");
    }
    if (input.id) {
      const lesson = state.lessons.find((item) => item.id === input.id);
      if (!lesson) throw new Error("השיעור לא נמצא");
      lesson.topicId = input.topicId;
      lesson.title = input.title;
      lesson.intro = input.intro;
      lesson.estimatedMinutes = input.estimatedMinutes;
      lesson.sources = input.sources;
      return lesson;
    }
    const lesson: Lesson = {
      id: crypto.randomUUID(),
      topicId: input.topicId,
      title: input.title,
      intro: input.intro,
      estimatedMinutes: input.estimatedMinutes,
      sources: input.sources,
      status: "draft",
      sortOrder:
        state.lessons.filter((item) => item.topicId === input.topicId).length + 1,
    };
    state.lessons.push(lesson);
    return lesson;
  });
}

export async function setLessonStatus(id: string, status: ContentStatus): Promise<Lesson> {
  return mutate((state) => {
    const lesson = state.lessons.find((item) => item.id === id);
    if (!lesson) throw new Error("השיעור לא נמצא");
    lesson.status = status;
    const relatedCase = state.cases.find((item) => item.lessonId === id);
    if (relatedCase && status === "published") {
      relatedCase.status = "published";
    }
    if (relatedCase && status === "draft") {
      relatedCase.status = "draft";
    }
    return lesson;
  });
}

export async function saveQuestion(input: {
  id?: string;
  lessonId: string;
  prompt: string;
  options: Question["options"];
  correctOptionId: string;
  explanation: string;
}): Promise<Question> {
  return mutate((state) => {
    if (input.id) {
      const question = state.questions.find((item) => item.id === input.id);
      if (!question) throw new Error("השאלה לא נמצאה");
      question.prompt = input.prompt;
      question.options = input.options;
      question.correctOptionId = input.correctOptionId;
      question.explanation = input.explanation;
      return question;
    }
    const question: Question = {
      id: crypto.randomUUID(),
      lessonId: input.lessonId,
      prompt: input.prompt,
      options: input.options,
      correctOptionId: input.correctOptionId,
      explanation: input.explanation,
      sortOrder: state.questions.filter((item) => item.lessonId === input.lessonId).length + 1,
    };
    state.questions.push(question);
    return question;
  });
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
  return mutate((state) => {
    if (input.id) {
      const caseStudy = state.cases.find((item) => item.id === input.id);
      if (!caseStudy) throw new Error("המקרה לא נמצא");
      caseStudy.title = input.title;
      caseStudy.facts = input.facts;
      caseStudy.question = input.question;
      caseStudy.discussion = input.discussion;
      caseStudy.sources = input.sources;
      return caseStudy;
    }
    const caseStudy: CaseStudy = {
      id: crypto.randomUUID(),
      lessonId: input.lessonId,
      title: input.title,
      facts: input.facts,
      question: input.question,
      discussion: input.discussion,
      sources: input.sources,
      status: "draft",
    };
    state.cases.push(caseStudy);
    return caseStudy;
  });
}
