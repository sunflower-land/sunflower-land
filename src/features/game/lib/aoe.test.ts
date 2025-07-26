import { CROPS } from "../types/crops";
import { canUseTimeBoostAOE, canUseYieldBoostAOE } from "./aoe";
import { IRON_RECOVERY_TIME, STONE_RECOVERY_TIME } from "./constants";

describe("canUseYieldAOE", () => {
  it("returns true for the Emerald Turtle if the boost has not been used", () => {
    const now = Date.now();

    const canUse = canUseYieldBoostAOE(
      {},
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      STONE_RECOVERY_TIME,
      now,
    );

    expect(canUse).toBe(true);
  });

  it("returns false for the Emerald Turtle if the emerald turtle boost has already been used", () => {
    const now = Date.now();

    const canUse = canUseYieldBoostAOE(
      {
        "Emerald Turtle": {
          "0": {
            "0": now,
          },
        },
      },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      STONE_RECOVERY_TIME,
      now,
    );

    expect(canUse).toBe(false);
  });

  it("returns true if the Emerald Turtle boost has been used on the first rock and is ready to be used again", () => {
    const now = Date.now();

    const canUse = canUseYieldBoostAOE(
      {
        "Emerald Turtle": {
          "0": {
            "0": now - STONE_RECOVERY_TIME,
          },
        },
      },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      STONE_RECOVERY_TIME,
      now,
    );

    expect(canUse).toBe(true);
  });

  it("returns true for the Emerald Turtle if the emerald turtle boost has not been used on the second rock", () => {
    const now = Date.now();

    const canUse = canUseYieldBoostAOE(
      {
        "Emerald Turtle": {
          "0": {
            "0": now,
          },
        },
      },
      "Emerald Turtle",
      { dx: 0, dy: 1 },
      STONE_RECOVERY_TIME,
      now,
    );

    expect(canUse).toBe(true);
  });

  it("returns false if the Emerald Turtle boost was used to mine stone, but now the player is trying to mine iron while still in the cooldown period", () => {
    const now = Date.now();
    const startTime = now - IRON_RECOVERY_TIME;

    const canUse = canUseYieldBoostAOE(
      {
        "Emerald Turtle": {
          "0": {
            "0": startTime + STONE_RECOVERY_TIME,
          },
        },
      },
      "Emerald Turtle",
      { dx: 0, dy: 0 },
      IRON_RECOVERY_TIME,
      startTime + IRON_RECOVERY_TIME,
    );

    expect(canUse).toBe(false);
  });
});

describe("canUseTimeBoostAOE", () => {
  it("returns true if the time boost has not been used", () => {
    const now = Date.now();

    const canUse = canUseTimeBoostAOE(
      {},
      "Basic Scarecrow",
      { dx: 0, dy: 0 },
      now,
    );

    expect(canUse).toBe(true);
  });

  it("returns false if the AOE is not ready yet", () => {
    const now = Date.now();

    const canUse = canUseTimeBoostAOE(
      {
        "Basic Scarecrow": {
          "0": {
            "0": now + CROPS["Sunflower"].harvestSeconds * 1000,
          },
        },
      },
      "Basic Scarecrow",
      { dx: 0, dy: 0 },
      now,
    );

    expect(canUse).toBe(false);
  });

  it("returns true if the AOE is ready", () => {
    const now = Date.now();

    const canUse = canUseTimeBoostAOE(
      {
        "Basic Scarecrow": {
          "0": {
            "0": now,
          },
        },
      },
      "Basic Scarecrow",
      { dx: 0, dy: 0 },
      now,
    );

    expect(canUse).toBe(true);
  });
});
