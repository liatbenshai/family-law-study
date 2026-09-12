import type { ContentStatus } from "./types";

export const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "טיוטה",
  review: "לבדיקה",
  published: "פורסם",
};

export function canLearnFrom(status: ContentStatus) {
  return status === "published";
}

export function canSendToReview(status: ContentStatus) {
  return status === "draft";
}

export function canPublish(status: ContentStatus) {
  return status === "review";
}

export function canUnpublish(status: ContentStatus) {
  return status === "published";
}
