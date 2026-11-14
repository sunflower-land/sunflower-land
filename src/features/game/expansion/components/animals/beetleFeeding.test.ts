import { getBeetleLevelGain } from "./beetleFeeding";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { Animal } from "features/game/types/game";

describe("getBeetleLevelGain", () => {
  const chicken = (experience: number, mud?: Animal["mud"]): Animal => ({
    id: "1",
    type: "Chicken",
    state: "idle",
    createdAt: 0,
    experience,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
    mud,
  });

  it("gains one level for a single level's batch", () => {
    // A fresh Chicken needs 60 XP to level 1; one Green Beetle (100 XP) covers it.
    expect(
      getBeetleLevelGain({
        state: INITIAL_FARM,
        animal: chicken(0),
        beetle: "Green Beetle",
        feeds: 1,
      }),
    ).toBe(1);
  });

  it("gains several levels when a batch overshoots", () => {
    // One Amber Beetle is 800 XP: a fresh Chicken lands on level 6.
    expect(
      getBeetleLevelGain({
        state: INITIAL_FARM,
        animal: chicken(0),
        beetle: "Amber Beetle",
        feeds: 1,
      }),
    ).toBe(6);
  });

  it("gains fewer levels when the player has fewer Beetles than the batch", () => {
    // Two Green Beetles (200 XP) stop at level 2; the full batch of three
    // would reach level 3.
    expect(
      getBeetleLevelGain({
        state: INITIAL_FARM,
        animal: chicken(0),
        beetle: "Green Beetle",
        feeds: 2,
      }),
    ).toBe(2);
  });

  it("counts Mud's bonus XP", () => {
    // Two muddy Green Beetles (250 XP) reach level 3; dry ones stop at 2.
    expect(
      getBeetleLevelGain({
        state: INITIAL_FARM,
        animal: chicken(0, { harvestsRemaining: 1 }),
        beetle: "Green Beetle",
        feeds: 2,
      }),
    ).toBe(3);
  });

  it("counts produce cycles at max level instead of levels", () => {
    // A max-level Chicken's cycle is 320 XP (2720 - 2400). One Amber Beetle
    // (800 XP) covers two full cycles; levels stopped rising at max.
    expect(
      getBeetleLevelGain({
        state: INITIAL_FARM,
        animal: chicken(2720),
        beetle: "Amber Beetle",
        feeds: 1,
      }),
    ).toBe(2);
  });

  it("counts the cycles past max on the way to max level", () => {
    // Level 14 is 2400 XP; one Amber Beetle reaches max (one level) and the
    // remaining 480 XP covers a second full 320 XP cycle.
    expect(
      getBeetleLevelGain({
        state: INITIAL_FARM,
        animal: chicken(2400),
        beetle: "Amber Beetle",
        feeds: 1,
      }),
    ).toBe(2);
  });

  it("gains nothing for less than a cycle at max level", () => {
    // 100 XP into a fresh 320 XP cycle leaves it unfinished.
    expect(
      getBeetleLevelGain({
        state: INITIAL_FARM,
        animal: chicken(2720),
        beetle: "Green Beetle",
        feeds: 1,
      }),
    ).toBe(0);
  });
});
