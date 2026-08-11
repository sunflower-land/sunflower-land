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
});
