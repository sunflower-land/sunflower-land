import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { BASIC_DECORATIONS, ShopDecorationName } from "../../types/decorations";
import { GameState } from "../../types/game";
import { buyDecoration } from "./buyDecoration";

const GAME_STATE: GameState = TEST_FARM;

describe("buyDecoration", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it("throws an error if item is not a decoration", () => {
    expect(() =>
      buyDecoration({
        state: GAME_STATE,
        action: {
          type: "decoration.bought",
          name: "Goblin Key" as ShopDecorationName,
        },
      }),
    ).toThrow("This item is not a decoration");
  });

  it.only("does not craft a decoration if there is not enough coins", () => {
    expect(() =>
      buyDecoration({
        state: {
          ...GAME_STATE,
          coins: 0,
        },
        action: {
          type: "decoration.bought",
          name: "Potted Sunflower",
        },
      }),
    ).toThrow("Insufficient coins");
  });

  it("does not craft decoration if requirements are not met", () => {
    expect(() =>
      buyDecoration({
        state: {
          ...GAME_STATE,
          coins: 1000,
          inventory: {},
        },
        action: {
          type: "decoration.bought",
          name: "Potted Sunflower",
        },
      }),
    ).toThrow("Insufficient ingredient: Sunflower");
  });

  it("burns the coins on purchase", () => {
    const coins = 1000;
    const state = buyDecoration({
      state: {
        ...GAME_STATE,
        coins,
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        type: "decoration.bought",
        name: "Potted Sunflower",
      },
    });

    expect(state.coins).toEqual(
      coins - (BASIC_DECORATIONS()["Potted Sunflower"].coins ?? 0),
    );
  });

  it("mints the newly bought decoration", () => {
    const coins = 1000;
    const item = "Potted Sunflower";
    const state = buyDecoration({
      state: {
        ...GAME_STATE,
        coins,
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        name: item,
        type: "decoration.bought",
      },
    });

    const oldAmount = GAME_STATE.inventory[item] ?? new Decimal(0);

    expect(state.inventory[item]).toEqual(oldAmount.add(1));
  });

  it("increments the coins spent activity", () => {
    const state = buyDecoration({
      state: {
        ...GAME_STATE,
        coins: 1000,
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        type: "decoration.bought",
        name: "Potted Sunflower",
      },
    });
    expect(state.bumpkin?.activity?.["Coins Spent"]).toEqual(
      BASIC_DECORATIONS()["Potted Sunflower"].coins ?? 0,
    );
  });

  it("increments the decoration bought activity", () => {
    const state = buyDecoration({
      state: {
        ...GAME_STATE,
        coins: 1000,
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        type: "decoration.bought",
        name: "Potted Sunflower",
      },
    });
    expect(state.bumpkin?.activity?.["Potted Sunflower Bought"]).toEqual(1);
  });

  it("requires ID does not exist", () => {
    expect(() =>
      buyDecoration({
        state: {
          ...GAME_STATE,
          coins: 1000,
          inventory: {
            Sunflower: new Decimal(150),
            "Basic Land": new Decimal(10),
          },
          buildings: {},
          collectibles: {
            "Potted Sunflower": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "decoration.bought",
          name: "Potted Sunflower",
          coordinates: { x: 0, y: 5 },
          id: "123",
        },
      }),
    ).toThrow("ID already exists");
  });

  it("requires decoration does not collide", () => {
    expect(() =>
      buyDecoration({
        state: {
          ...GAME_STATE,
          coins: 1000,
          inventory: {
            Sunflower: new Decimal(150),
            "Basic Land": new Decimal(10),
          },
          buildings: {},
          collectibles: {
            "Potted Sunflower": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "decoration.bought",
          name: "Potted Sunflower",
          coordinates: { x: 0, y: 0 },
          id: "456",
        },
      }),
    ).toThrow("Decoration collides");
  });

  it("places decoration", () => {
    const state = buyDecoration({
      state: {
        ...GAME_STATE,
        coins: 1000,
        inventory: {
          Sunflower: new Decimal(150),
          "Basic Land": new Decimal(10),
        },
        buildings: {},
        collectibles: {},
      },
      action: {
        type: "decoration.bought",
        name: "Potted Sunflower",
        coordinates: { x: 0, y: 5 },
        id: "456",
      },
    });

    expect(state.collectibles["Potted Sunflower"]?.[0]?.coordinates).toEqual({
      x: 0,
      y: 5,
    });
  });
});
