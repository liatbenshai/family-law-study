import assert from "node:assert/strict";
import test from "node:test";
import type { Topic } from "./types.ts";
import {
  childTopics,
  parentTopics,
  topicPathLabel,
  topicSubtreeIds,
} from "./topic-tree.ts";

const topics: Topic[] = [
  {
    id: "p1",
    slug: "foundations",
    title: "יסודות",
    description: "",
    sortOrder: 1,
    parentId: null,
  },
  {
    id: "c1",
    slug: "courts",
    title: "ערכאות",
    description: "",
    sortOrder: 2,
    parentId: "p1",
  },
  {
    id: "c2",
    slug: "race",
    title: "מרוץ",
    description: "",
    sortOrder: 1,
    parentId: "p1",
  },
  {
    id: "p2",
    slug: "support",
    title: "מזונות",
    description: "",
    sortOrder: 2,
    parentId: null,
  },
];

test("parent topics stay at the top level and keep sort order", () => {
  assert.deepEqual(
    parentTopics(topics).map((topic) => topic.id),
    ["p1", "p2"],
  );
});

test("child topics are sorted under their parent", () => {
  assert.deepEqual(
    childTopics(topics, "p1").map((topic) => topic.slug),
    ["race", "courts"],
  );
});

test("subtree includes the parent and nested children", () => {
  assert.deepEqual(topicSubtreeIds(topics, "p1").sort(), ["c1", "c2", "p1"]);
  assert.deepEqual(topicSubtreeIds(topics, "c1"), ["c1"]);
});

test("path label joins parent and child", () => {
  assert.equal(topicPathLabel(topics, topics[0]), "יסודות");
  assert.equal(topicPathLabel(topics, topics[1]), "יסודות · ערכאות");
});
