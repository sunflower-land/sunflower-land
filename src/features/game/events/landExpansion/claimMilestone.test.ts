import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { getFishByType } from "features/island/hud/components/codex/lib/utils";
import { claimMilestone } from "./claimMilestone";
import { getKeys } from "features/game/types/decorations";
import { FISH } from "features/game/types/fishing";

const farm: GameState = { ...TEST_FARM };

describe("claim milestone", () => {
  const date = Date.now();

  it("throws an error if requirement is not met", () => {
    expect(() =>
      claimMilestone({
        state: farm,
        action: {
          type: "milestone.claimed",
          milestone: "Novice Angler",
        },
      }),
    ).toThrow("You do not meet the requirements");
  });

  it("throws an error if milestone has already been claimed", () => {
    expect(() =>
      claimMilestone({
        state: {
          ...farm,
          milestones: {
            "Novice Angler": 1,
          },
        },
        action: {
          type: "milestone.claimed",
          milestone: "Novice Angler",
        },
      }),
    ).toThrow("You already have this milestone");
  });

  it("claims Novice Angler milestone", () => {
    const basicFish = getFishByType().basic;

    const farmActivity = basicFish.reduce(
      (acc, fish) => {
        acc[`${fish} Caught`] = 5;

        return acc;
      },
      {} as GameState["farmActivity"],
    );

    const state = claimMilestone({
      state: {
        ...farm,
        farmActivity,
      },
      action: {
        type: "milestone.claimed",
        milestone: "Novice Angler",
      },
    });

    expect(state.milestones["Novice Angler"]).toBe(1);
  });

  it("claims Fish Encyclopedia milestone when all 30 are caught", () => {
    const allFish = getKeys(FISH).slice(0, 30);

    const farmActivity = allFish.reduce(
      (acc, fish) => {
        acc[`${fish} Caught`] = 5;

        return acc;
      },
      {} as GameState["farmActivity"],
    );

    const state = claimMilestone({
      state: {
        ...farm,
        farmActivity,
      },
      action: {
        type: "milestone.claimed",
        milestone: "Fish Encyclopedia",
      },
    });

    expect(state.wardrobe["Bucket O' Worms"]).toBe(1);
  });

  it("claims Marine Biologist milestone when all fish are caught", () => {
    const allFish = getKeys(FISH);

    const farmActivity = allFish.reduce(
      (acc, fish) => {
        acc[`${fish} Caught`] = 5;

        return acc;
      },
      {} as GameState["farmActivity"],
    );

    const state = claimMilestone({
      state: {
        ...farm,
        farmActivity,
      },
      action: {
        type: "milestone.claimed",
        milestone: "Marine Biologist",
      },
    });

    expect(state.wardrobe["Radiant Dumbo"]).toBe(1);
  });

  it("adds a wearable reward to wardrobe when milestone is claimed", () => {
    const basicFish = getFishByType().basic;

    const farmActivity = basicFish.reduce(
      (acc, fish) => {
        acc[`${fish} Caught`] = 5;

        return acc;
      },
      {} as GameState["farmActivity"],
    );

    const state = claimMilestone({
      state: {
        ...farm,
        farmActivity,
      },
      action: {
        type: "milestone.claimed",
        milestone: "Novice Angler",
      },
    });

    expect(state.wardrobe["Sunflower Rod"]).toBe(1);
  });

  // Add test when we add a milestone that rewards an inventory item
  it.todo(
    "adds a inventory item reward to inventory when milestone is claimed",
  );
});
