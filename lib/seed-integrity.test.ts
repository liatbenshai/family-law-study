import assert from "node:assert/strict";
import test from "node:test";
import { cases, lessons, questions } from "../data/seed.ts";
import { topics } from "../data/topics.ts";

test("every topic slug is unique and parents exist", () => {
  const ids = new Set(topics.map((topic) => topic.id));
  const slugs = topics.map((topic) => topic.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const topic of topics) {
    if (topic.parentId) assert.equal(ids.has(topic.parentId), true, topic.slug);
  }
  assert.equal(topics.filter((topic) => topic.parentId === null).length, 8);
});

test("lessons questions and cases point at existing records", () => {
  const topicIds = new Set(topics.map((topic) => topic.id));
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  for (const lesson of lessons) {
    assert.equal(topicIds.has(lesson.topicId), true, lesson.title);
    assert.ok(lesson.estimatedMinutes >= 1 && lesson.estimatedMinutes <= 15);
    assert.ok(lesson.sources.length > 0);
  }
  for (const question of questions) {
    assert.equal(lessonIds.has(question.lessonId), true, question.id);
    assert.ok(question.options.some((option) => option.id === question.correctOptionId));
  }
  for (const item of cases) {
    assert.equal(lessonIds.has(item.lessonId), true, item.title);
  }
});

test("published lessons have questions a case and sources", () => {
  const published = lessons.filter((lesson) => lesson.status === "published");
  assert.ok(published.length >= 9);
  for (const lesson of published) {
    const lessonQuestions = questions.filter((question) => question.lessonId === lesson.id);
    const lessonCase = cases.find((item) => item.lessonId === lesson.id);
    assert.ok(lessonQuestions.length >= 2, lesson.title);
    assert.ok(lessonCase, lesson.title);
    assert.equal(lessonCase?.status, "published");
  }
});
