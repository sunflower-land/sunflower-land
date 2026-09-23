import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { CAVE_BATCH_DURATION_MS } from "features/game/types/caveRecipes";
import { getInstantGems } from "features/game/lib/getInstantGems";
import {
  SPEED_UP_CAVE_BATCH_ERRORS,
  speedUpCaveBatch,
} from "./speedUpCaveBatch";

const NOW = 1_700_000_000_000;

const growingState = (): GameState => ({
  ...TEST_FARM,
  inventory: { ...TEST_FARM.inventory, Gem: new Decimal(1000) },
  gems: { history: {} },
  cave: {
    builtAt: 1,
    tier: 1,
    machines: {
      "1": {
        batch: {
          recipe: "Mushroom",
          startedAt: NOW,
          readyAt: NOW + CAVE_BATCH_DURATION_MS,
        },
      },
    },
  },
});

const finish = (state: GameState, machineId = "1", createdAt = NOW) =>
  speedUpCaveBatch({
    state,
    action: { type: "cave.batchSpedUp", machineId },
    createdAt,
  });

describe("speedUpCaveBatch (cave.batchSpedUp)", () => {
  it("charges the gem cost and completes the batch", () => {
    const before = growingState();
    const gems = getInstantGems({
      readyAt: before.cave!.machines["1"].batch!.readyAt,
      now: NOW,
      game: before,
    });
    expect(gems).toBeGreaterThan(0);

    const next = finish(before);
    expect(next.inventory.Gem?.toNumber()).toBe(
      before.inventory.Gem!.minus(gems).toNumber(),
    );
    expect(next.cave?.machines["1"].batch?.readyAt).toBe(NOW);
  });

  it("rejects when there is no batch", () => {
    const state = growingState();
    state.cave!.machines["1"] = {};
    expect(() => finish(state)).toThrow(SPEED_UP_CAVE_BATCH_ERRORS.NO_BATCH);
  });

  it("rejects when the batch is already ready", () => {
    const state = growingState();
    state.cave!.machines["1"].batch!.readyAt = NOW;
    expect(() => finish(state)).toThrow(
      SPEED_UP_CAVE_BATCH_ERRORS.ALREADY_READY,
    );
  });

  it("rejects when the player lacks Gems", () => {
    const state = growingState();
    state.inventory.Gem = new Decimal(0);
    expect(() => finish(state)).toThrow(
      SPEED_UP_CAVE_BATCH_ERRORS.INSUFFICIENT_GEMS,
    );
  });
});
