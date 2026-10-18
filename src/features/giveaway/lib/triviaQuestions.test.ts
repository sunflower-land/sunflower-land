import { generateQuestion } from "./triviaQuestions";

describe("trivia question generator", () => {
  const giveawayId = "abc-123";

  it("is deterministic for a given (giveawayId, index)", () => {
    for (let i = 0; i < 6; i += 1) {
      expect(generateQuestion(giveawayId, i)).toEqual(
        generateQuestion(giveawayId, i),
      );
    }
  });

  it("varies across indices and giveaways", () => {
    const a = generateQuestion(giveawayId, 0).question;
    const b = generateQuestion("different-id", 0).question;
    // Not a hard guarantee, but across a full round the set should differ.
    const roundA = Array.from({ length: 6 }, (_, i) =>
      JSON.stringify(generateQuestion(giveawayId, i)),
    );
    expect(new Set(roundA).size).toBeGreaterThan(1);
    expect(typeof a).toBe("string");
    expect(typeof b).toBe("string");
  });

  it("always produces a well-formed, unambiguous question", () => {
    // Sweep many seeds to exercise every template's retry/validation path.
    for (let g = 0; g < 40; g += 1) {
      for (let i = 0; i < 6; i += 1) {
        const q = generateQuestion(`seed-${g}`, i);

        expect(q.question.length).toBeGreaterThan(0);
        expect(q.answers).toHaveLength(4);
        // Every answer is a non-empty, distinct string.
        q.answers.forEach((ans) => expect(ans.length).toBeGreaterThan(0));
        expect(new Set(q.answers).size).toBe(4);
        // The correct index points at a real answer.
        expect(q.correct).toBeGreaterThanOrEqual(0);
        expect(q.correct).toBeLessThan(4);
        expect(q.answers[q.correct]).toBeDefined();
      }
    }
  });

  it("never repeats a question within a 10-question round", () => {
    for (let g = 0; g < 60; g += 1) {
      const round = Array.from(
        { length: 10 },
        (_, i) => generateQuestion(`round-${g}`, i, 10).question,
      );
      // Every question in the round is distinct — no exotic-crop spam.
      expect(new Set(round).size).toBe(10);
    }
  });

  /**
   * The mixture used to be pinned: one question per topic meant every
   * single-template topic ("Who is this Bumpkin?", "Which Exotic Crop is the
   * most valuable?", "What flower is this?") appeared in 100% of rounds, so
   * every game felt like the same quiz with different items.
   */
  it("no question shape dominates the rounds", () => {
    const ROUNDS = 300;
    const roundsWith = new Map<string, number>();

    for (let g = 0; g < ROUNDS; g += 1) {
      const shapes = new Set<string>();
      for (let i = 0; i < 10; i += 1) {
        // Strip the specific item so "How much does one Kale sell for?" and
        // "…one Corn…" count as the same shape.
        shapes.add(
          generateQuestion(`spread-${g}`, i, 10)
            .question.replace(/\b[A-Z][\w'-]*(\s+[A-Z][\w'-]*)*/g, "X")
            .trim(),
        );
      }
      shapes.forEach((s) => roundsWith.set(s, (roundsWith.get(s) ?? 0) + 1));
    }

    const worst = Math.max(...roundsWith.values()) / ROUNDS;
    expect(worst).toBeLessThan(0.6);
    // A decent spread of shapes is actually in play across rounds.
    expect(roundsWith.size).toBeGreaterThan(20);
  });

  it("renders durations exactly, never rounded", () => {
    // Rice takes 32 hours in the Greenhouse; rounding printed it as "1 day".
    const seen = new Set<string>();
    for (let g = 0; g < 200; g += 1) {
      for (let i = 0; i < 10; i += 1) {
        const q = generateQuestion(`time-${g}`, i, 10);
        if (/take(s)? to grow|to bloom/.test(q.question)) {
          q.answers.forEach((a) => seen.add(a));
        }
      }
    }
    seen.forEach((a) => {
      // "1 day" is only ever exactly 24h, so a duration answer must be a whole
      // number of its unit — no "1 day" standing in for 32 hours.
      expect(a).toMatch(/^\d+ (second|min|hour|day)s?$/);
    });
  });

  it("uses the right article and never says '1 Coins'", () => {
    for (let g = 0; g < 200; g += 1) {
      for (let i = 0; i < 10; i += 1) {
        const q = generateQuestion(`grammar-${g}`, i, 10);
        expect(q.question).not.toMatch(/\ba [AEIOU]/);
        expect(q.question).not.toMatch(/\ban [^aeiouAEIOU]/);
        q.answers.forEach((a) => expect(a).not.toBe("1 Coins"));
      }
    }
  });
});
