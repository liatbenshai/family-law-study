export type GradeQuality = 1 | 3 | 4 | 5;

export type Sm2Input = {
  easiness: number;
  intervalDays: number;
  repetitions: number;
};

export type Sm2Result = Sm2Input & {
  nextReviewAt: Date;
};

const MIN_EASINESS = 1.3;

export function applySm2(
  card: Sm2Input,
  quality: GradeQuality,
  now = new Date(),
): Sm2Result {
  let { easiness, intervalDays, repetitions } = card;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easiness));
    }
    repetitions += 1;
  }

  easiness =
    easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easiness < MIN_EASINESS) {
    easiness = MIN_EASINESS;
  }

  const nextReviewAt = new Date(now);
  nextReviewAt.setHours(0, 0, 0, 0);
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return {
    easiness: Math.round(easiness * 100) / 100,
    intervalDays,
    repetitions,
    nextReviewAt,
  };
}

export const GRADE_LABELS: Record<GradeQuality, string> = {
  1: "שוב",
  3: "קשה",
  4: "טוב",
  5: "קל",
};
