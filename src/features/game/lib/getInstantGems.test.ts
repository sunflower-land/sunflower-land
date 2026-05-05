import { INITIAL_FARM } from "features/game/lib/constants";
import {
  chargeCoinsForSpeedUp,
  COINS_PER_GEM,
  DAILY_COIN_SPEEDUP_LIMIT,
  getCoinsSpentOnSpeedUpsToday,
  getInstantGems,
  hasDinoEggTrophyBoost,
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

describe("Dino Egg Trophy coin-based speed-up", () => {
  const createdAt = new Date("2024-06-15T12:00:00Z").getTime();
  const today = "2024-06-15";

  function gameWithTrophy(overrides: Partial<GameState> = {}): GameState {
    return {
      ...INITIAL_FARM,
      coins: 100_000,
      gems: {},
      collectibles: {
        "Dino Egg Trophy": [
          {
            id: "1",
            createdAt: 0,
            coordinates: { x: 0, y: 0 },
            readyAt: 0,
          },
        ],
      },
      ...overrides,
    };
  }

  describe("hasDinoEggTrophyBoost", () => {
    it("returns false when trophy is not placed", () => {
      expect(hasDinoEggTrophyBoost({ ...INITIAL_FARM })).toBe(false);
    });

    it("returns true when trophy is placed on the farm", () => {
      expect(hasDinoEggTrophyBoost(gameWithTrophy())).toBe(true);
    });

    it("returns false when trophy is owned but not placed", () => {
      const game: GameState = {
        ...INITIAL_FARM,
        collectibles: {
          "Dino Egg Trophy": [
            {
              id: "1",
              createdAt: 0,
              coordinates: undefined,
              readyAt: 0,
            },
          ],
        },
      };
      expect(hasDinoEggTrophyBoost(game)).toBe(false);
    });
  });

  describe("getCoinsSpentOnSpeedUpsToday", () => {
    it("returns 0 when no history exists", () => {
      expect(getCoinsSpentOnSpeedUpsToday(gameWithTrophy(), createdAt)).toBe(0);
    });

    it("returns coinsSpent for today only", () => {
      const game = gameWithTrophy({
        gems: {
          history: {
            [today]: { spent: 5, coinsSpent: 1234 },
          },
        },
      });
      expect(getCoinsSpentOnSpeedUpsToday(game, createdAt)).toBe(1234);
    });

    it("returns 0 when only an older date has coinsSpent", () => {
      const game = gameWithTrophy({
        gems: {
          history: {
            "2024-06-14": { spent: 5, coinsSpent: 1234 },
          },
        },
      });
      expect(getCoinsSpentOnSpeedUpsToday(game, createdAt)).toBe(0);
    });
  });

  describe("chargeCoinsForSpeedUp", () => {
    it("throws when Dino Egg Trophy is not placed", () => {
      const game: GameState = { ...INITIAL_FARM, coins: 100_000 };
      expect(() => chargeCoinsForSpeedUp({ game, gems: 5, createdAt })).toThrow(
        "Dino Egg Trophy required",
      );
    });

    it("throws when daily coin cap would be exceeded", () => {
      const game = gameWithTrophy({
        gems: {
          history: {
            [today]: {
              spent: 0,
              coinsSpent: DAILY_COIN_SPEEDUP_LIMIT - 49,
            },
          },
        },
      });
      expect(() => chargeCoinsForSpeedUp({ game, gems: 1, createdAt })).toThrow(
        "Daily coin speed-up limit reached",
      );
    });

    it("allows spending exactly up to the daily cap", () => {
      const game = gameWithTrophy({
        gems: {
          history: {
            [today]: {
              spent: 0,
              coinsSpent: DAILY_COIN_SPEEDUP_LIMIT - 50,
            },
          },
        },
      });
      const result = chargeCoinsForSpeedUp({ game, gems: 1, createdAt });
      expect(result.gems.history?.[today]?.coinsSpent).toBe(
        DAILY_COIN_SPEEDUP_LIMIT,
      );
    });

    it("throws when player has insufficient coins", () => {
      const game = gameWithTrophy({ coins: 49 });
      expect(() => chargeCoinsForSpeedUp({ game, gems: 1, createdAt })).toThrow(
        "Insufficient coins",
      );
    });

    it("converts gems to coins at COINS_PER_GEM (50) ratio and decrements coins", () => {
      const game = gameWithTrophy({ coins: 1000 });
      const result = chargeCoinsForSpeedUp({ game, gems: 5, createdAt });
      expect(result.coins).toBe(1000 - 5 * COINS_PER_GEM);
    });

    it("records both coinsSpent and gem-equivalent spent for today", () => {
      const game = gameWithTrophy();
      const result = chargeCoinsForSpeedUp({ game, gems: 7, createdAt });
      expect(result.gems.history?.[today]?.coinsSpent).toBe(7 * COINS_PER_GEM);
      expect(result.gems.history?.[today]?.spent).toBe(7);
    });

    it("accumulates coinsSpent across multiple coin speed-ups in the same day", () => {
      let game = gameWithTrophy();
      game = chargeCoinsForSpeedUp({ game, gems: 3, createdAt });
      game = chargeCoinsForSpeedUp({ game, gems: 4, createdAt });
      expect(game.gems.history?.[today]?.coinsSpent).toBe(7 * COINS_PER_GEM);
      expect(game.gems.history?.[today]?.spent).toBe(7);
    });

    it("clears entries from older days (single-day bucket)", () => {
      const game = gameWithTrophy({
        gems: {
          history: {
            "2024-06-14": { spent: 99, coinsSpent: 9999 },
          },
        },
      });
      const result = chargeCoinsForSpeedUp({ game, gems: 1, createdAt });
      expect(result.gems.history?.["2024-06-14"]).toBeUndefined();
      expect(result.gems.history?.[today]).toBeDefined();
    });

    it("does NOT track 'Instant Gems Spent' in the coin path", () => {
      // The gem-equivalent is recorded in `gems.history[today].spent` for
      // the cost-ramp; analytics that read "Instant Gems Spent" should only
      // see actual gem burns.
      const game = gameWithTrophy();
      const result = chargeCoinsForSpeedUp({ game, gems: 6, createdAt });
      expect(result.farmActivity["Instant Gems Spent"]).toBeUndefined();
    });

    it("tracks the coin amount under farmActivity 'Instant Coins Spent'", () => {
      const game = gameWithTrophy();
      const result = chargeCoinsForSpeedUp({ game, gems: 6, createdAt });
      expect(result.farmActivity["Instant Coins Spent"]).toBe(
        6 * COINS_PER_GEM,
      );
    });

    it("makes subsequent gem cost ramp via the multiplier", () => {
      let game: GameState = gameWithTrophy({ coins: 1_000_000 });
      const readyAt = createdAt + 60 * 60 * 1000; // 1 hour
      const initialCost = getInstantGems({ readyAt, now: createdAt, game });
      expect(initialCost).toBe(5);

      game = chargeCoinsForSpeedUp({ game, gems: 100, createdAt });

      const rampedCost = getInstantGems({ readyAt, now: createdAt, game });
      expect(rampedCost).toBe(6); // round(5 * 1.15) = 6
    });

    it("preserves coinsSpent when a gem-paid speed-up runs the same day", () => {
      // Regression: coin -> gem -> coin near cap. A gem-paid speed-up
      // calling makeGemHistory must not reset gems.history[today].coinsSpent,
      // otherwise the player can spend another full daily cap of coins.
      let game = gameWithTrophy({ coins: 1_000_000 });
      // First coin spend: 100 gem-equivalents = 5,000 coins.
      game = chargeCoinsForSpeedUp({ game, gems: 100, createdAt });
      expect(game.gems.history?.[today]?.coinsSpent).toBe(5_000);

      // Now perform a gem-paid speed-up via makeGemHistory.
      game = makeGemHistory({ game, amount: 10, createdAt });

      // coinsSpent must still be tracked.
      expect(game.gems.history?.[today]?.coinsSpent).toBe(5_000);
      // The gem-equivalent counter accumulates both spends.
      expect(game.gems.history?.[today]?.spent).toBe(110);

      // Pushing another coin spend that would exceed the cap when added to
      // the existing 5,000 must still be rejected.
      const oversize = (DAILY_COIN_SPEEDUP_LIMIT - 5_000) / COINS_PER_GEM + 1;
      expect(() =>
        chargeCoinsForSpeedUp({ game, gems: oversize, createdAt }),
      ).toThrow("Daily coin speed-up limit reached");
    });
  });
});
