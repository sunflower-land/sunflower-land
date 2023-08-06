import { TEST_FARM } from "features/game/lib/constants";
import { BumpkinActivityName } from "features/game/types/bumpkinActivity";
import { Bumpkin, GameState } from "features/game/types/game";
import { getProgress, isTaskComplete } from "./HayseedHankTask";

const BUMPKIN = TEST_FARM.bumpkin as Bumpkin;
const HAYSEED_HANK: GameState["hayseedHank"] = {
  ...TEST_FARM.hayseedHank,
  progress: {
    bumpkinId: BUMPKIN.id,
    startedAt: 1,
    startCount: 10,
  },
  choresCompleted: 0,
  chore: {
    activity: "Sunflower Harvested" as BumpkinActivityName,
    description: "Harvest 20 Sunflowers",
    requirement: 20,
    reward: {
      items: { "Solar Flare Ticket": 1 },
    },
  },
};

describe("getProgress", () => {
  it("returns 0 if hayseed hank progress is not defined", () => {
    expect(
      getProgress({
        ...TEST_FARM,
        hayseedHank: { ...HAYSEED_HANK, progress: undefined },
        bumpkin: BUMPKIN,
      })
    ).toBe(0);
  });

  it("returns 0 if bumpkin activity is not found and start count is 0", () => {
    expect(
      getProgress({
        ...TEST_FARM,
        hayseedHank: {
          ...HAYSEED_HANK,
          progress: {
            bumpkinId: BUMPKIN.id,
            startedAt: 1,
            startCount: 0,
          },
        },
        bumpkin: {
          ...BUMPKIN,
          activity: undefined,
        },
      })
    ).toBe(0);
  });

  it("returns 3 if bumpkin harvested 13 sunflowers in total and task started when bumpkin harvested 10 sunflowers", () => {
    expect(
      getProgress({
        ...TEST_FARM,
        hayseedHank: HAYSEED_HANK,
        bumpkin: {
          ...BUMPKIN,
          activity: {
            "Sunflower Harvested": 13,
          },
        },
      })
    ).toBe(3);
  });
});

describe("isTaskComplete", () => {
  it("returns false if hayseed hank progress is not defined", () => {
    expect(
      isTaskComplete({
        ...TEST_FARM,
        hayseedHank: { ...HAYSEED_HANK, progress: undefined },
        bumpkin: { ...BUMPKIN },
      })
    ).toBe(false);
  });

  it("return false if player harvested 4/20 sunflowers", () => {
    expect(
      isTaskComplete({
        ...TEST_FARM,
        hayseedHank: HAYSEED_HANK,
        bumpkin: {
          ...BUMPKIN,
          activity: {
            "Sunflower Harvested":
              4 + (HAYSEED_HANK?.progress?.startCount ?? 0),
          },
        },
      })
    ).toBeFalsy();
  });

  it("return true if player harvested 20/20 sunflowers", () => {
    expect(
      isTaskComplete({
        ...TEST_FARM,
        hayseedHank: HAYSEED_HANK,
        bumpkin: {
          ...BUMPKIN,
          activity: {
            "Sunflower Harvested":
              20 + (HAYSEED_HANK?.progress?.startCount ?? 0),
          },
        },
      })
    ).toBeTruthy();
  });

  it("return true if player harvested 42/20 sunflowers", () => {
    expect(
      isTaskComplete({
        ...TEST_FARM,
        hayseedHank: HAYSEED_HANK,
        bumpkin: {
          ...BUMPKIN,
          activity: {
            "Sunflower Harvested":
              42 + (HAYSEED_HANK?.progress?.startCount ?? 0),
          },
        },
      })
    ).toBeTruthy();
  });
});
