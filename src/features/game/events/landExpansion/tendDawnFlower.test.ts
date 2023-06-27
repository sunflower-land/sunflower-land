import Decimal from "decimal.js-light";
import { tendDawnFlower } from "./tendDawnFlower";
import { Bumpkin, DawnBreaker, GameState } from "features/game/types/game";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";

const farm: GameState = {
  ...TEST_FARM,
  dawnBreaker: {
    answeredRiddleIds: [],
    currentWeek: 8,
    lanternsCraftedByWeek: {},
    party: {},
  },
};

describe("tendDawnFlower", () => {
  const eggplantBumpkin = {
    ...INITIAL_BUMPKIN,
    equipped: {
      ...INITIAL_BUMPKIN.equipped,
      onesie: "Eggplant Onesie",
    },
  } as Bumpkin;
  it("throws an error if bumpkin is not wearing an Eggplant oneise", () => {
    expect(() =>
      tendDawnFlower({
        action: {
          type: "dawnFlower.tended",
        },
        state: {
          ...farm,
          bumpkin: INITIAL_BUMPKIN,
        },
      })
    ).toThrow("Bumpkin not wearing Eggplant Onesie");
  });

  it("plants dawn flower", () => {
    const now = Date.now();
    const state = tendDawnFlower({
      action: {
        type: "dawnFlower.tended",
      },
      state: {
        ...farm,
        bumpkin: eggplantBumpkin,
      },
      createdAt: now,
    });

    expect(state.dawnBreaker?.dawnFlower).toEqual({
      plantedAt: now,
      tendedCount: 1,
      tendedAt: now,
    });
  });

  it("throws an error if tended in last 24 hours", () => {
    expect(() =>
      tendDawnFlower({
        action: {
          type: "dawnFlower.tended",
        },
        state: {
          ...farm,
          dawnBreaker: {
            ...(farm.dawnBreaker as DawnBreaker),
            dawnFlower: {
              plantedAt: Date.now() - 23 * 60 * 60 * 1000,
              tendedAt: Date.now() - 23 * 60 * 60 * 1000,
              tendedCount: 0,
            },
          },
          bumpkin: eggplantBumpkin,
        },
      })
    ).toThrow("Flower in cooldown");
  });
  it("tends flower once", () => {
    const now = Date.now();
    const state = tendDawnFlower({
      action: {
        type: "dawnFlower.tended",
      },
      state: {
        ...farm,
        dawnBreaker: {
          ...(farm.dawnBreaker as DawnBreaker),
          dawnFlower: {
            plantedAt: Date.now() - 25 * 60 * 60 * 1000,
            tendedAt: Date.now() - 25 * 60 * 60 * 1000,
            tendedCount: 1,
          },
        },
        bumpkin: eggplantBumpkin,
      },
      createdAt: now,
    });
    expect(state.dawnBreaker?.dawnFlower).toEqual({
      plantedAt: now,
      tendedCount: 2,
      tendedAt: now,
    });
  });

  it("tends flower 9 times", () => {
    const now = Date.now();
    const state = tendDawnFlower({
      action: {
        type: "dawnFlower.tended",
      },
      state: {
        ...farm,
        dawnBreaker: {
          ...(farm.dawnBreaker as DawnBreaker),
          dawnFlower: {
            plantedAt: Date.now() - 24 * 8 * 60 * 60 * 1000,
            tendedAt: Date.now() - 25 * 60 * 60 * 1000,
            tendedCount: 8,
          },
        },
        bumpkin: eggplantBumpkin,
      },
      createdAt: now,
    });
    expect(state.dawnBreaker?.dawnFlower).toEqual({
      plantedAt: now,
      tendedCount: 9,
      tendedAt: now,
    });
  });

  it("harvests dawn flower on 10th turn", () => {
    const now = Date.now();
    const state = tendDawnFlower({
      action: {
        type: "dawnFlower.tended",
      },
      state: {
        ...farm,
        dawnBreaker: {
          ...(farm.dawnBreaker as DawnBreaker),
          dawnFlower: {
            plantedAt: Date.now() - 24 * 8 * 60 * 60 * 1000,
            tendedAt: Date.now() - 25 * 60 * 60 * 1000,
            tendedCount: 9,
          },
        },
        bumpkin: eggplantBumpkin,
      },
      createdAt: now,
    });
    expect(state.dawnBreaker?.dawnFlower).toEqual({
      plantedAt: now,
      tendedCount: 10,
      tendedAt: now,
    });
    expect(state.inventory["Dawn Flower"]).toEqual(new Decimal(1));
  });
  it("throws error if already harvested", () => {
    expect(() =>
      tendDawnFlower({
        action: {
          type: "dawnFlower.tended",
        },
        state: {
          ...farm,
          dawnBreaker: {
            ...(farm.dawnBreaker as DawnBreaker),
            dawnFlower: {
              plantedAt: Date.now() - 24 * 8 * 60 * 60 * 1000,
              tendedAt: Date.now() - 25 * 60 * 60 * 1000,
              tendedCount: 10,
            },
          },
          bumpkin: eggplantBumpkin,
        },
      })
    ).toThrow("Dawn Flower already harvested");
  });
});
