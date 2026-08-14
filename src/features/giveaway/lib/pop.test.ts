import {
  popRound,
  isPopOver,
  popCount,
  popVerdict,
  roundScores,
  popBots,
  botRate,
  botWaters,
  POP_INTRO_MS,
  POP_WATER_MS,
  POP_ROUND_MS,
  POP_GAME_MS,
  POP_ROUNDS,
} from "./pop";

describe("popRound", () => {
  it("plays the intro before round 1", () => {
    expect(popRound(0)).toEqual({
      index: 0,
      phase: "intro",
      msLeft: POP_INTRO_MS,
    });
  });

  it("opens the watering window when the intro ends", () => {
    const round = popRound(POP_INTRO_MS);
    expect(round.index).toEqual(0);
    expect(round.phase).toEqual("water");
    expect(round.msLeft).toEqual(POP_WATER_MS);
  });

  it("switches to the reveal once the watering window closes", () => {
    const round = popRound(POP_INTRO_MS + POP_WATER_MS);
    expect(round.index).toEqual(0);
    expect(round.phase).toEqual("reveal");
  });

  it("advances to the next round after the reveal", () => {
    const round = popRound(POP_INTRO_MS + POP_ROUND_MS);
    expect(round.index).toEqual(1);
    expect(round.phase).toEqual("water");
  });

  it("clamps to the final round once the game is over", () => {
    expect(popRound(POP_GAME_MS + 10_000).index).toEqual(POP_ROUNDS - 1);
  });

  it("is over exactly at the end of the last reveal", () => {
    expect(isPopOver(POP_GAME_MS - 1)).toBe(false);
    expect(isPopOver(POP_GAME_MS)).toBe(true);
  });
});

describe("popCount", () => {
  it("pops nobody from a field of one", () => {
    expect(popCount(1)).toEqual(0);
    expect(popCount(0)).toEqual(0);
  });

  it("pops roughly 30% of the field", () => {
    expect(popCount(10)).toEqual(3);
    expect(popCount(20)).toEqual(6);
    expect(popCount(14)).toEqual(4);
  });

  it("always pops at least one, and never everyone", () => {
    expect(popCount(2)).toEqual(1);
    expect(popCount(3)).toEqual(1);
  });
});

describe("popVerdict", () => {
  const field = [
    { id: "a", score: 10 },
    { id: "b", score: 40 },
    { id: "c", score: 25 },
    { id: "d", score: 5 },
    { id: "e", score: 33 },
  ];

  it("pops the highest scorers", () => {
    // 30% of 5 = 1.5 → 2 popped: the two biggest waterers.
    expect([...popVerdict(field, 0).popped].sort()).toEqual(["b", "e"]);
  });

  it("leaves the low scorers alone", () => {
    const { popped } = popVerdict(field, 0);
    expect(popped).not.toContain("d");
    expect(popped).not.toContain("a");
  });

  it("reports the cap — the lowest score that still popped", () => {
    expect(popVerdict(field, 0).cap).toEqual(33);
  });

  it("reports the safe line — the most anyone got away with", () => {
    expect(popVerdict(field, 0).safeLine).toEqual(25);
  });

  it("caps at Infinity when nobody pops", () => {
    const solo = popVerdict([{ id: "a", score: 9 }], 0);
    expect(solo.popped).toEqual([]);
    expect(solo.cap).toEqual(Infinity);
    expect(solo.safeLine).toEqual(9);
  });

  it("is deterministic", () => {
    expect(popVerdict(field, 2)).toEqual(popVerdict(field, 2));
  });

  it("does not pop the same players every round when everyone ties", () => {
    const tied = Array.from({ length: 10 }, (_, i) => ({
      id: `p${i}`,
      score: 0,
    }));
    const rounds = Array.from({ length: POP_ROUNDS }, (_, r) =>
      [...popVerdict(tied, r).popped].sort().join(","),
    );
    expect(new Set(rounds).size).toBeGreaterThan(1);
  });
});

describe("roundScores", () => {
  it("scores a round as the climb since the round-start snapshot", () => {
    expect(
      roundScores([
        { id: "me", points: 118, pointsAtRoundStart: 96 },
        { id: "bot-0", points: 140, pointsAtRoundStart: 96 },
      ]),
    ).toEqual([
      { id: "me", score: 22 },
      { id: "bot-0", score: 44 },
    ]);
  });

  it("ignores what anyone banked in earlier rounds", () => {
    // A runaway leader overall can still be the most restrained this round.
    const [leader, rookie] = roundScores([
      { id: "leader", points: 500, pointsAtRoundStart: 495 },
      { id: "rookie", points: 40, pointsAtRoundStart: 10 },
    ]);
    expect(leader.score).toBeLessThan(rookie.score);
  });

  it("never reports a negative round score", () => {
    // A late-joining player's snapshot can land above their reported total.
    expect(
      roundScores([{ id: "mmo-x", points: 0, pointsAtRoundStart: 12 }]),
    ).toEqual([{ id: "mmo-x", score: 0 }]);
  });

  it("judges the local player by exactly the same rule as everyone else", () => {
    const growers = [
      { id: "me", points: 60, pointsAtRoundStart: 0 },
      { id: "bot-0", points: 130, pointsAtRoundStart: 100 },
      { id: "bot-1", points: 12, pointsAtRoundStart: 0 },
      { id: "mmo-a", points: 208, pointsAtRoundStart: 200 },
    ];
    // Round scores: me 60, bot-0 30, bot-1 12, mmo-a 8 → 1 pops, and it's us.
    expect(popVerdict(roundScores(growers), 0).popped).toEqual(["me"]);
  });
});

describe("the simulated field", () => {
  it("hands out stable, distinct neighbours per giveaway", () => {
    const bots = popBots("abc", 13);
    expect(bots).toHaveLength(13);
    expect(new Set(bots.map((b) => b.id)).size).toEqual(13);
    expect(popBots("abc", 13)).toEqual(bots);
  });

  it("fields different neighbours for different giveaways", () => {
    expect(popBots("abc", 8)).not.toEqual(popBots("xyz", 8));
  });

  it("re-rolls each bot's pace every round", () => {
    const rates = Array.from({ length: POP_ROUNDS }, (_, r) =>
      botRate("abc", "bot-0", r),
    );
    expect(new Set(rates).size).toEqual(POP_ROUNDS);
  });

  it("waters bots at a human-beatable pace", () => {
    // A mashing player out-waters even the fastest bot — which is the point:
    // tapping flat out puts you in the top 30%.
    const fastest = botWaters(3.4, POP_WATER_MS);
    expect(fastest).toBeLessThan(60);
  });

  it("accumulates a bot's waters over the round and then stops", () => {
    expect(botWaters(2, 0)).toEqual(0);
    expect(botWaters(2, 5000)).toEqual(10);
    expect(botWaters(2, POP_WATER_MS)).toEqual(30);
    expect(botWaters(2, POP_WATER_MS + 5000)).toEqual(30);
  });
});
