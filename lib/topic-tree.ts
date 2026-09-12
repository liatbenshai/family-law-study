import type { Topic } from "./types.ts";

export function sortTopics(topics: Topic[]) {
  return [...topics].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "he"));
}

export function parentTopics(topics: Topic[]) {
  return sortTopics(topics.filter((topic) => topic.parentId === null));
}

export function childTopics(topics: Topic[], parentId: string) {
  return sortTopics(topics.filter((topic) => topic.parentId === parentId));
}

export function topicById(topics: Topic[], id: string) {
  return topics.find((topic) => topic.id === id) ?? null;
}

export function topicSubtreeIds(topics: Topic[], topicId: string): string[] {
  const ids = [topicId];
  for (const child of childTopics(topics, topicId)) {
    ids.push(...topicSubtreeIds(topics, child.id));
  }
  return ids;
}

export function topicPathLabel(topics: Topic[], topic: Topic): string {
  if (!topic.parentId) return topic.title;
  const parent = topicById(topics, topic.parentId);
  return parent ? `${parent.title} · ${topic.title}` : topic.title;
}
