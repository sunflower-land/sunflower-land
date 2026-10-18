import Decimal from "decimal.js-light";

import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CROPS } from "features/game/types/crops";
import type { GameState } from "features/game/types/game";
import { applyBuff } from "./buffs";
import {
  computeReadyAt,
  getCropPlotBoostWindows,
} from "features/game/lib/boostWindows";

const dateNow = Date.now();

describe("applyBuff", () => {
  it("moves Basic Scarecrow AOE availability when Power hour speeds up an existing crop", () => {
    const cropTime = CROPS["Sunflower"].harvestSeconds * 1000;
    const remainingTime = 30 * 1000;
    const timeReduction = remainingTime / 2;
    const plantedAt = dateNow + remainingTime - cropTime;
    const readyAt = dateNow + remainingTime;

    const state: GameState = {
      ...INITIAL_FARM,
      bumpkin: TEST_BUMPKIN,
      inventory: { "Sunflower Seed": new Decimal(1) },
      collectibles: {
        "Basic Scarecrow": [
          {
            id: "123",
            createdAt: dateNow,
            coordinates: { x: 0, y: 0 },
            readyAt: dateNow - 12 * 60 * 1000,
          },
        ],
      },
      aoe: {
        "Basic Scarecrow": {
          0: {
            "-2": readyAt,
          },
        },
      },
      crops: {
        0: {
          createdAt: dateNow,
          x: 0,
          y: -2,
          crop: {
            name: "Sunflower",
            plantedAt,
          },
        },
      },
    };

    const stateWithPowerHour = applyBuff({
      buff: "Power hour",
      game: state,
      now: dateNow,
    });

    expect(stateWithPowerHour.crops[0].crop?.boostedTime).toBe(timeReduction);
    expect(stateWithPowerHour.aoe["Basic Scarecrow"]?.[0]?.["-2"]).toBe(
      dateNow + timeReduction,
    );
  });

  describe("Power hour history", () => {
    const HOUR = 60 * 60 * 1000;
    const firstStartedAt = Date.UTC(2026, 8, 13);

    const withPowerHour = (overrides: Partial<GameState> = {}): GameState => ({
      ...INITIAL_FARM,
      bumpkin: TEST_BUMPKIN,
      boostHistory: undefined,
      buffs: { "Power hour": { startedAt: firstStartedAt, durationMS: HOUR } },
      ...overrides,
    });

    it("archives the previous Power Hour before starting a new one", () => {
      const now = firstStartedAt + 48 * HOUR;

      const state = applyBuff({
        buff: "Power hour",
        game: withPowerHour(),
        now,
      });

      expect(state.buffs?.["Power hour"]).toEqual({
        startedAt: now,
        durationMS: HOUR,
      });
      expect(state.boostHistory?.["Power hour"]).toEqual([
        { from: firstStartedAt, to: firstStartedAt + HOUR },
      ]);
    });

    it("does not archive on a first-ever Power Hour", () => {
      const state = applyBuff({
        buff: "Power hour",
        game: withPowerHour({ buffs: undefined }),
        now: firstStartedAt,
      });

      expect(state.boostHistory?.["Power hour"]).toBeUndefined();
    });

    it("does not archive a Power Hour re-applied at the same start", () => {
      const state = applyBuff({
        buff: "Power hour",
        game: withPowerHour(),
        now: firstStartedAt,
      });

      expect(state.boostHistory?.["Power hour"]).toBeUndefined();
    });

    it("does not mutate the input game", () => {
      const game = withPowerHour();

      applyBuff({ buff: "Power hour", game, now: firstStartedAt + 48 * HOUR });

      expect(game.boostHistory).toBeUndefined();
    });

    it("keeps a windowed crop's head start from the previous Power Hour", () => {
      // 48h of work planted 30 minutes into the first Power Hour: that half hour
      // at 2× banks 1h, so by 46.5h later 47h is done and the new Power Hour
      // finishes the last hour in 30 minutes.
      const plantedAt = firstStartedAt + HOUR / 2;
      const game = withPowerHour({
        crops: {
          0: {
            createdAt: plantedAt,
            x: 0,
            y: 0,
            crop: { name: "Sunflower", plantedAt, baseDurationMs: 48 * HOUR },
          },
        },
      });

      const state = applyBuff({
        buff: "Power hour",
        game,
        now: firstStartedAt + 47 * HOUR,
      });

      expect(
        computeReadyAt({
          startedAt: plantedAt,
          baseDurationMs: 48 * HOUR,
          windows: getCropPlotBoostWindows(state),
        }),
      ).toEqual(firstStartedAt + 47.5 * HOUR);
    });
  });
});
