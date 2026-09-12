import { writeFileSync } from "node:fs";
import { cases, lessons, questions } from "../data/seed.ts";
import { topics } from "../data/topics.ts";

function sqlString(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

function topicInsert(topic: (typeof topics)[number]) {
  const parent = topic.parentId ? sqlString(topic.parentId) : "null";
  return `insert into public.topics (id, parent_id, slug, title, description, sort_order) values (${sqlString(topic.id)}, ${parent}, ${sqlString(topic.slug)}, ${sqlString(topic.title)}, ${sqlString(topic.description)}, ${topic.sortOrder}) on conflict (id) do update set parent_id = excluded.parent_id, slug = excluded.slug, title = excluded.title, description = excluded.description, sort_order = excluded.sort_order;`;
}

function lessonInsert(lesson: (typeof lessons)[number]) {
  return `insert into public.lessons (id, topic_id, title, intro, estimated_minutes, sources, status, sort_order) values (${sqlString(lesson.id)}, ${sqlString(lesson.topicId)}, ${sqlString(lesson.title)}, ${sqlString(lesson.intro)}, ${lesson.estimatedMinutes}, ${sqlString(lesson.sources)}, ${sqlString(lesson.status)}::public.content_status, ${lesson.sortOrder}) on conflict (id) do update set topic_id = excluded.topic_id, title = excluded.title, intro = excluded.intro, estimated_minutes = excluded.estimated_minutes, sources = excluded.sources, status = excluded.status, sort_order = excluded.sort_order;`;
}

function questionInsert(question: (typeof questions)[number]) {
  return `insert into public.questions (id, lesson_id, prompt, options, correct_option_id, explanation, sort_order) values (${sqlString(question.id)}, ${sqlString(question.lessonId)}, ${sqlString(question.prompt)}, ${sqlString(JSON.stringify(question.options))}::jsonb, ${sqlString(question.correctOptionId)}, ${sqlString(question.explanation)}, ${question.sortOrder}) on conflict (id) do update set lesson_id = excluded.lesson_id, prompt = excluded.prompt, options = excluded.options, correct_option_id = excluded.correct_option_id, explanation = excluded.explanation, sort_order = excluded.sort_order;`;
}

function caseInsert(item: (typeof cases)[number]) {
  return `insert into public.cases (id, lesson_id, title, facts, question, discussion, sources, status) values (${sqlString(item.id)}, ${sqlString(item.lessonId)}, ${sqlString(item.title)}, ${sqlString(item.facts)}, ${sqlString(item.question)}, ${sqlString(item.discussion)}, ${sqlString(item.sources)}, ${sqlString(item.status)}::public.content_status) on conflict (id) do update set lesson_id = excluded.lesson_id, title = excluded.title, facts = excluded.facts, question = excluded.question, discussion = excluded.discussion, sources = excluded.sources, status = excluded.status;`;
}

const parents = topics.filter((topic) => topic.parentId === null);
const children = topics.filter((topic) => topic.parentId !== null);

const body = `-- Generated from data/*.ts — run npm run seed:sql after content changes.

${parents.map(topicInsert).join("\n")}

${children.map(topicInsert).join("\n")}

${lessons.map(lessonInsert).join("\n")}

${questions.map(questionInsert).join("\n")}

${cases.map(caseInsert).join("\n")}
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), `${body.trim()}\n`);
console.log("wrote supabase/seed.sql");
