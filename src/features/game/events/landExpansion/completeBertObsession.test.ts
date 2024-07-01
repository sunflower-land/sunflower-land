import Decimal from "decimal.js-light";
import { completeBertObsession } from "./completeBertObsession";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";

describe("completeBertObsession", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("throws an error if no bumpkin exists", () => {
    const now = new Date("2023-08-16T00:00:00.000Z");
    jest.setSystemTime(now);

    expect(() =>
      completeBertObsession({
        state: {
          ...TEST_FARM,
          npcs: { bert: { deliveryCount: 1 } },
          bumpkin: undefined,
        },
        action: {
          type: "bertObsession.completed",
        },
      }),
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws an error if no NPCs exists", () => {
    const now = new Date("2023-08-16T00:00:00.000Z");
    jest.setSystemTime(now);

    expect(() =>
      completeBertObsession({
        state: {
          ...TEST_FARM,
          npcs: undefined,
          bumpkin: INITIAL_BUMPKIN,
        },
        action: {
          type: "bertObsession.completed",
        },
      }),
    ).toThrow("NPCs does not exist");
  });

  it("throws an error if no discovery is available", () => {
    const now = new Date("2023-08-10T00:00:00.000Z");
    jest.setSystemTime(now);

    expect(() =>
      completeBertObsession({
        state: {
          ...TEST_FARM,
          npcs: { bert: { deliveryCount: 1 } },
          bumpkin: INITIAL_BUMPKIN,
        },
        action: {
          type: "bertObsession.completed",
        },
      }),
    ).toThrow("No discovery available");
  });

  it("throws an error if no item is not available on inventory", () => {
    const now = new Date("2023-08-16T00:00:00.000Z");
    jest.setSystemTime(now);
    expect(() =>
      completeBertObsession({
        state: {
          ...TEST_FARM,
          npcs: { bert: { deliveryCount: 1 } },
          bumpkin: INITIAL_BUMPKIN,
          bertObsession: {
            name: "Bale",
            type: "collectible",
            startDate: now.getTime() - 10000,
            endDate: now.getTime() + 10000,
            reward: 3,
          },
        },
        action: {
          type: "bertObsession.completed",
        },
      }),
    ).toThrow("You do not have the collectible required");
  });

  it("throws an error if wearable is not available on wardrobe", () => {
    const now = new Date("2023-08-20T00:00:00.000Z");
    jest.setSystemTime(now);
    expect(() =>
      completeBertObsession({
        state: {
          ...TEST_FARM,
          npcs: { bert: { deliveryCount: 1 } },
          bumpkin: INITIAL_BUMPKIN,
          bertObsession: {
            name: "Halo",
            type: "wearable",
            startDate: now.getTime() - 10000,
            endDate: now.getTime() + 10000,
            reward: 3,
          },
        },

        action: {
          type: "bertObsession.completed",
        },
      }),
    ).toThrow("You do not have the wearable required");
  });

  it("completes Bert Discovery with Inventory Item", () => {
    const now = new Date("2023-08-16T00:00:00.000Z");
    jest.setSystemTime(now);
    const result = completeBertObsession({
      state: {
        ...TEST_FARM,
        npcs: { bert: { deliveryCount: 1 } },
        bumpkin: INITIAL_BUMPKIN,
        bertObsession: {
          name: "Bale",
          type: "collectible",
          startDate: now.getTime() - 10000,
          endDate: now.getTime() + 10000,
          reward: 3,
        },
        inventory: {
          Bale: new Decimal(1),
        },
      },
      action: {
        type: "bertObsession.completed",
      },
    });

    expect(result.inventory["Crow Feather"]).toEqual(new Decimal(3));
  });

  it("completes Bert Discovery with wearable", () => {
    const now = new Date("2023-08-20T00:00:00.000Z");
    jest.setSystemTime(now);
    const result = completeBertObsession({
      state: {
        bertObsession: {
          name: "Halo",
          type: "wearable",
          startDate: now.getTime() - 10000,
          endDate: now.getTime() + 10000,
          reward: 3,
        },
        ...TEST_FARM,
        npcs: { bert: { deliveryCount: 1 } },
        bumpkin: INITIAL_BUMPKIN,
        wardrobe: {
          Halo: 1,
        },
      },
      action: {
        type: "bertObsession.completed",
      },
    });

    expect(result.inventory["Crow Feather"]).toEqual(new Decimal(3));
  });

  it("updates Bert QuestCompletedAt", () => {
    const now = new Date("2023-08-20T00:00:00.000Z");
    jest.setSystemTime(now);

    const result = completeBertObsession({
      state: {
        bertObsession: {
          name: "Halo",
          type: "wearable",
          startDate: now.getTime() - 10000,
          endDate: now.getTime() + 10000,
          reward: 3,
        },
        ...TEST_FARM,
        npcs: { bert: { deliveryCount: 1 } },
        bumpkin: INITIAL_BUMPKIN,
        wardrobe: {
          Halo: 1,
        },
      },
      action: {
        type: "bertObsession.completed",
      },
    });

    expect(result.npcs?.bert?.questCompletedAt).toEqual(now.getTime());
  });

  it("throws an error if obsession already completed", () => {
    const now = new Date("2023-08-17T00:00:00.000Z");
    jest.setSystemTime(now);

    expect(() =>
      completeBertObsession({
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          bertObsession: {
            name: "Halo",
            type: "wearable",
            startDate: now.getTime() - 10000,
            endDate: now.getTime() + 10000,
            reward: 3,
          },
          wardrobe: {
            Halo: 1,
          },
          npcs: {
            bert: {
              questCompletedAt: now.getTime(),
              deliveryCount: 0,
            },
          },
        },
        action: {
          type: "bertObsession.completed",
        },
      }),
    ).toThrow("This obsession is already completed");
  });
});
