export type ContentStatus = "draft" | "review" | "published";

export type Profile = {
  id: string;
  displayName: string | null;
  email: string | null;
  isAdmin: boolean;
};

export type Topic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
  parentId: string | null;
};

export type Lesson = {
  id: string;
  topicId: string;
  title: string;
  intro: string;
  estimatedMinutes: number;
  sources: string;
  status: ContentStatus;
  sortOrder: number;
};

export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  lessonId: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  sortOrder: number;
};

export type CaseStudy = {
  id: string;
  lessonId: string;
  title: string;
  facts: string;
  question: string;
  discussion: string;
  sources: string;
  status: ContentStatus;
};

export type ReviewCard = {
  id: string;
  userId: string;
  questionId: string;
  easiness: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: string;
  lastReviewedAt: string | null;
};

export type LessonProgress = {
  userId: string;
  lessonId: string;
  completedAt: string | null;
  lastVisitedAt: string;
};

export type Attempt = {
  id: string;
  userId: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  createdAt: string;
};

export type GradeQuality = 1 | 3 | 4 | 5;

export type DueReview = {
  card: ReviewCard;
  question: Question;
  lessonTitle: string;
};

export type TopicWithProgress = Topic & {
  publishedLessonCount: number;
  completedLessonCount: number;
};
