import { INITIAL_FARM } from "features/game/lib/constants";
import {
  getInstantGems,
  makeGemHistory,
} from "features/game/lib/getInstantGems";
import { GameState } from "features/game/types/game";

const THIRTY_MIN_MS = 30 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

function createGameWithGemsSpent(amount: number, dateStr: string): GameState {
  return {
    ...INITIAL_FARM,
    gems: {
      history: {
        [dateStr]: { spent: amount },
      },
    },
  };
}

function createBaseGame(): GameState {
  return {
    ...INITIAL_FARM,
    gems: {
      history: {},
    },
  };
}

describe("getInstantGems", () => {
  const now = new Date("2024-01-01T12:00:00Z").getTime();

  describe("SECONDS_TO_GEMS threshold mapping", () => {
    const thresholds: Array<[number, number, string]> = [
      [60, 1, "1 min"],
      [300, 2, "5 min"],
      [600, 3, "10 min"],
      [1800, 4, "30 min"],
      [3600, 5, "1 hr"],
      [7200, 8, "2 hr"],
      [14400, 14, "4 hr"],
      [21600, 20, "6 hr"],
      [28800, 22, "8 hr"],
      [43200, 25, "12 hr"],
      [86400, 40, "24 hr"],
      [129600, 60, "36 hr"],
      [172800, 80, "48 hr"],
      [259200, 110, "72 hr"],
      [345600, 140, "96 hr"],
    ];

    thresholds.forEach(([secondsLeft, expectedGems, description]) => {
      it(`returns ${expectedGems} gems for ${description}`, () => {
        const readyAt = now + secondsLeft * 1000;
        expect(
          getInstantGems({
            readyAt,
            now,
            game: createBaseGame(),
          }),
        ).toBe(expectedGems);
      });
    });
  });

  describe("above max threshold", () => {
    it("returns default 140 gems when secondsLeft exceeds 96 hr", () => {
      const secondsLeft = 100 * 60 * 60;
      const readyAt = now + secondsLeft * 1000;
      expect(
        getInstantGems({
          readyAt,
          now,
          game: createBaseGame(),
        }),
      ).toBe(140);
    });
  });

  describe("boundary conditions", () => {
    it("returns 5 gems at exactly 3600 sec threshold", () => {
      const readyAt = now + 3600 * 1000;
      expect(
        getInstantGems({
          readyAt,
          now,
          game: createBaseGame(),
        }),
      ).toBe(5);
    });

    it("returns 4 gems at 1800 sec, 5 gems at 1801 sec (boundary)", () => {
      expect(
        getInstantGems({
          readyAt: now + 1800 * 1000,
          now,
          game: createBaseGame(),
        }),
      ).toBe(4);
      expect(
        getInstantGems({
          readyAt: now + 1801 * 1000,
          now,
          game: createBaseGame(),
        }),
      ).toBe(5);
    });

    it("returns 1 gem when 0 seconds left", () => {
      const readyAt = now;
      expect(
        getInstantGems({
          readyAt,
          now,
          game: createBaseGame(),
        }),
      ).toBe(1);
    });
  });

  describe("cumulative sequence (base 4, multiplier 1.15)", () => {
    const transitionPoints: Array<[number, number, number]> = [
      [23, 5, 93],
      [51, 6, 234],
      [71, 7, 355],
      [86, 8, 461],
      [97, 9, 550],
      [106, 10, 632],
      [113, 11, 703],
      [119, 12, 770],
      [124, 13, 831],
      [129, 14, 897],
      [132, 15, 940],
      [135, 16, 986],
      [138, 17, 1035],
      [141, 18, 1087],
      [143, 19, 1124],
      [145, 20, 1163],
      [147, 21, 1204],
      [148, 22, 1226],
      [150, 23, 1271],
    ];

    it("matches expected cost and total at transitions", () => {
      let game = createGameWithGemsSpent(0, "2024-01-01");
      let totalGems = 0;
      const readyAt = now + THIRTY_MIN_MS;

      for (let count = 1; count <= 150; count++) {
        const cost = getInstantGems({
          readyAt,
          now,
          game,
        });
        totalGems += cost;
        game = makeGemHistory({
          game,
          amount: cost,
          createdAt: now,
        });

        const transition = transitionPoints.find(([c]) => c === count);
        if (transition) {
          const [, expectedCost, expectedTotal] = transition;
          expect(cost).toBe(expectedCost);
          expect(totalGems).toBe(expectedTotal);
        }
      }
    });

    it("cost is 4 for first 17 purchases", () => {
      const readyAt = now + THIRTY_MIN_MS;

      for (let spent = 0; spent < 68; spent += 4) {
        const gameWithSpent = createGameWithGemsSpent(spent, "2024-01-01");
        expect(
          getInstantGems({
            readyAt,
            now,
            game: gameWithSpent,
          }),
        ).toBe(4);
      }
    });
  });

  describe("daily multiplier spot checks", () => {
    const dateStr = "2024-01-01";

    it("returns 4 when 0 gems spent (base 4)", () => {
      const game = createGameWithGemsSpent(0, dateStr);
      expect(
        getInstantGems({
          readyAt: now + THIRTY_MIN_MS,
          now,
          game,
        }),
      ).toBe(4);
    });

    it("returns 5 when 85 gems spent (base 4)", () => {
      const game = createGameWithGemsSpent(85, dateStr);
      expect(
        getInstantGems({
          readyAt: now + THIRTY_MIN_MS,
          now,
          game,
        }),
      ).toBe(5);
    });

    it("returns 6 when 100 gems spent (base 5)", () => {
      const game = createGameWithGemsSpent(100, dateStr);
      expect(
        getInstantGems({
          readyAt: now + ONE_HOUR_MS,
          now,
          game,
        }),
      ).toBe(6);
    });

    it("returns 6 when 228 gems spent (base 4)", () => {
      const game = createGameWithGemsSpent(228, dateStr);
      expect(
        getInstantGems({
          readyAt: now + THIRTY_MIN_MS,
          now,
          game,
        }),
      ).toBe(6);
    });

    it("returns 12 when 596 gems spent (base 5)", () => {
      const game = createGameWithGemsSpent(596, dateStr);
      expect(
        getInstantGems({
          readyAt: now + ONE_HOUR_MS,
          now,
          game,
        }),
      ).toBe(12);
    });
  });

  describe("rounding (ROUND_HALF_UP)", () => {
    const dateStr = "2024-01-01";

    it("rounds up base 4 at 85 spent (4.51 -> 5)", () => {
      const game = createGameWithGemsSpent(85, dateStr);
      expect(
        getInstantGems({
          readyAt: now + THIRTY_MIN_MS,
          now,
          game,
        }),
      ).toBe(5);
    });

    it("rounds up base 4 at 100 spent (4.8 -> 5)", () => {
      const game = createGameWithGemsSpent(100, dateStr);
      expect(
        getInstantGems({
          readyAt: now + THIRTY_MIN_MS,
          now,
          game,
        }),
      ).toBe(5);
    });
  });

  describe("missing / undefined game.gems", () => {
    it("returns base cost when game.gems.history is undefined", () => {
      const game = { ...INITIAL_FARM, gems: {} } as GameState;
      expect(
        getInstantGems({
          readyAt: now + THIRTY_MIN_MS,
          now,
          game,
        }),
      ).toBe(4);
    });
  });

  describe("date isolation", () => {
    it("ignores gems spent on other days", () => {
      const game = createGameWithGemsSpent(500, "2024-01-02");
      expect(
        getInstantGems({
          readyAt: now + THIRTY_MIN_MS,
          now,
          game,
        }),
      ).toBe(4);
    });
  });
});

describe("makeGemHistory", () => {
  const now = new Date("2024-01-01T12:00:00Z").getTime();
  const dateStr = "2024-01-01";

  it("adds amount to game.gems.history[today].spent", () => {
    const game = createBaseGame();
    const result = makeGemHistory({
      game,
      amount: 10,
      createdAt: now,
    });
    expect(result.gems.history?.[dateStr]?.spent).toBe(10);
  });

  it("accumulates when adding multiple times", () => {
    let game = createBaseGame();
    game = makeGemHistory({ game, amount: 5, createdAt: now });
    game = makeGemHistory({ game, amount: 5, createdAt: now });
    expect(game.gems.history?.[dateStr]?.spent).toBe(10);
  });

  it("overwrites other dates and keeps only today", () => {
    const game = createGameWithGemsSpent(100, "2024-01-02");
    const result = makeGemHistory({
      game,
      amount: 10,
      createdAt: now,
    });
    expect(result.gems.history?.[dateStr]?.spent).toBe(10);
    expect(result.gems.history?.["2024-01-02"]).toBeUndefined();
  });

  it("creates gems.history if missing", () => {
    const game = { ...INITIAL_FARM, gems: {} } as GameState;
    const result = makeGemHistory({
      game,
      amount: 10,
      createdAt: now,
    });
    expect(result.gems.history?.[dateStr]?.spent).toBe(10);
  });

  it("calls trackFarmActivity for Gems Spent", () => {
    const game = createBaseGame();
    const result = makeGemHistory({
      game,
      amount: 10,
      createdAt: now,
    });
    expect(result.farmActivity["Instant Gems Spent"]).toBe(10);
  });
});
