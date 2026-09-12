import { applySm2, type Sm2Input } from "./sm2.ts";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

const fresh: Sm2Input = {
  easiness: 2.5,
  intervalDays: 0,
  repetitions: 0,
};

describe("applySm2", () => {
  it("schedules a one-day retry after a failed recall", () => {
    const now = new Date("2026-09-12T10:00:00Z");
    const result = applySm2(fresh, 1, now);
    assert.equal(result.repetitions, 0);
    assert.equal(result.intervalDays, 1);
    assert.equal(result.nextReviewAt.toISOString().slice(0, 10), "2026-09-13");
  });

  it("uses a 1-day then 6-day interval on the first two successes", () => {
    const first = applySm2(fresh, 4);
    assert.equal(first.repetitions, 1);
    assert.equal(first.intervalDays, 1);

    const second = applySm2(first, 4);
    assert.equal(second.repetitions, 2);
    assert.equal(second.intervalDays, 6);
  });

  it("multiplies the interval by easiness after two successes", () => {
    const afterTwo = applySm2(applySm2(fresh, 5), 5);
    const third = applySm2(afterTwo, 5);
    assert.equal(third.intervalDays, Math.round(6 * afterTwo.easiness));
    assert.ok(third.easiness >= 2.5);
  });

  it("never lets easiness drop below 1.3", () => {
    let card: Sm2Input = { easiness: 1.3, intervalDays: 1, repetitions: 0 };
    for (let i = 0; i < 8; i += 1) {
      card = applySm2(card, 1);
    }
    assert.equal(card.easiness, 1.3);
  });
});
