import Decimal from "decimal.js-light";
import { startComposter, getCompostAmount, getReadyAt } from "./startComposter";
import type { GameState, TemperateSeasonName } from "features/game/types/game";
import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import {
  SEASON_COMPOST_REQUIREMENTS,
  composterDetails,
} from "features/game/types/composters";
import { getKeys } from "lib/object";

const season: TemperateSeasonName = "winter";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  season: { season, startedAt: Date.now() },
};

describe("start Compost Bin", () => {
  const dateNow = Date.now();

  it("throws an error if Composter is not placed", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Compost Bin": [
              {
                coordinates: undefined,
                createdAt: 0,
                readyAt: 0,
                id: "0",
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Compost Bin" },
      }),
    ).toThrow("Composter does not exist");
  });

  it("throws an error if Compost Bin is already started", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Compost Bin": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  items: { "Sprout Mix": 10 },
                  startedAt: dateNow - 10000,
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Compost Bin" },
      }),
    ).toThrow("Composter is already composting");
  });

  it("throws an error if the user does not have the requirements", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Compost Bin": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Compost Bin" },
      }),
    ).toThrow("Missing requirements");
  });

  it("removes ingredients from inventory", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Potato: new Decimal(10),
        Cabbage: new Decimal(3),
      },
      buildings: {
        "Compost Bin": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
    };

    const newState = startComposter({
      state,
      action: { type: "composter.started", building: "Compost Bin" },
    });

    expect(newState.inventory.Potato).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Cabbage).toStrictEqual(new Decimal(0));
  });

  it("starts BasicComposters", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Potato: new Decimal(10),
        Cabbage: new Decimal(3),
      },
      buildings: {
        "Compost Bin": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Compost Bin" },
    });

    expect(newState.buildings["Compost Bin"]?.[0].producing?.startedAt).toBe(
      dateNow,
    );
    expect(newState.buildings["Compost Bin"]?.[0].producing?.readyAt).toBe(
      dateNow + 6 * 60 * 60 * 1000,
    );
  });

  it("gives a 10% speed boost if the player has the Soil Krabby", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Potato: new Decimal(10),
        Cabbage: new Decimal(3),
      },
      buildings: {
        "Compost Bin": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      collectibles: {
        "Soil Krabby": [
          { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
        ],
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Compost Bin" },
    });

    expect(newState.buildings["Compost Bin"]?.[0].producing?.readyAt).toBe(
      dateNow + 5.4 * 60 * 60 * 1000,
    );
  });

  it("gives +3 Sprout Mix with Efficient Bin skill", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Potato: new Decimal(10),
        Cabbage: new Decimal(3),
      },
      buildings: {
        "Compost Bin": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: { "Efficient Bin": 1 },
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Compost Bin" },
    });

    expect(
      newState.buildings["Compost Bin"]?.[0].producing?.items["Sprout Mix"],
    ).toBe(15);
  });

  it("doesn't gives +3 Sprout Mix with Efficient Bin skill if not Compost Bin", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Onion: new Decimal(5),
        Turnip: new Decimal(2),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: { "Efficient Bin": 1 },
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Turbo Composter" },
    });

    expect(
      newState.buildings["Turbo Composter"]?.[0].producing?.items["Sprout Mix"],
    ).toBeUndefined();

    expect(
      newState.buildings["Turbo Composter"]?.[0].producing?.items[
        "Fruitful Blend"
      ],
    ).toBe(3);
  });

  it("give a 10% speed boost if the player had Swift Decomposer skill", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Potato: new Decimal(10),
        Cabbage: new Decimal(3),
      },
      buildings: {
        "Compost Bin": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: { "Swift Decomposer": 1 },
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Compost Bin" },
    });

    expect(newState.buildings["Compost Bin"]?.[0].producing?.readyAt).toBe(
      dateNow + 5.4 * 60 * 60 * 1000,
    );
  });
});

describe("start Turbo Composter", () => {
  const dateNow = Date.now();

  it("throws an error if Composter does not exist", () => {
    expect(() =>
      startComposter({
        state: GAME_STATE,
        action: { type: "composter.started", building: "Turbo Composter" },
      }),
    ).toThrow("Composter does not exist");
  });

  it("throws an error if Turbo Composter is already started", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Turbo Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  items: { "Fruitful Blend": 10 },
                  startedAt: dateNow - 10000,
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Turbo Composter" },
      }),
    ).toThrow("Composter is already composting");
  });

  it("throws an error if the user does not have the requirements", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          inventory: {},
          buildings: {
            "Turbo Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Turbo Composter" },
      }),
    ).toThrow("Missing requirements");
  });

  it("removes ingredients from inventory", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Onion: new Decimal(5),
        Turnip: new Decimal(2),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
    };

    const newState = startComposter({
      state,
      action: { type: "composter.started", building: "Turbo Composter" },
    });

    expect(newState.inventory.Onion).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Turnip).toStrictEqual(new Decimal(0));
  });

  it("starts Turbo Composters", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Onion: new Decimal(5),
        Turnip: new Decimal(2),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Turbo Composter" },
    });

    expect(
      newState.buildings["Turbo Composter"]?.[0].producing?.startedAt,
    ).toBe(dateNow);
    expect(newState.buildings["Turbo Composter"]?.[0].producing?.readyAt).toBe(
      dateNow + 8 * 60 * 60 * 1000,
    );
  });

  it("gives a 10% speed boost if the player has the Soil Krabby", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Onion: new Decimal(5),
        Turnip: new Decimal(2),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      collectibles: {
        "Soil Krabby": [
          { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
        ],
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Turbo Composter" },
    });

    expect(newState.buildings["Turbo Composter"]?.[0].producing?.readyAt).toBe(
      dateNow + 7.2 * 60 * 60 * 1000,
    );
  });

  it("gives +5 Fruitful Blend with Turbo Charged skill", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Onion: new Decimal(5),
        Turnip: new Decimal(2),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: { "Turbo Charged": 1 },
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Turbo Composter" },
    });

    expect(
      newState.buildings["Turbo Composter"]?.[0].producing?.items[
        "Fruitful Blend"
      ],
    ).toBe(8);
  });

  it("doesn't gives +5 Fruitful Blend with Turbo Charged skill if not a Turbo Composter", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Potato: new Decimal(10),
        Cabbage: new Decimal(3),
      },
      buildings: {
        "Compost Bin": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: { "Turbo Charged": 1 },
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Compost Bin" },
    });

    expect(
      newState.buildings["Turbo Composter"]?.[0].producing?.items[
        "Fruitful Blend"
      ],
    ).toBeUndefined();

    expect(
      newState.buildings["Compost Bin"]?.[0].producing?.items["Sprout Mix"],
    ).toBe(10);
  });

  it("give a 10% speed boost if the player had Swift Decomposer skill", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Onion: new Decimal(5),
        Turnip: new Decimal(2),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: { "Swift Decomposer": 1 },
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Turbo Composter" },
    });

    expect(newState.buildings["Turbo Composter"]?.[0].producing?.readyAt).toBe(
      dateNow + 7.2 * 60 * 60 * 1000,
    );
  });
  it("should not remove fertiliser from inventory if the player has Composting Overhaul skill", () => {
    const result = startComposter({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: { "Composting Overhaul": 1 },
        },
        inventory: {
          "Fruitful Blend": new Decimal(10),
          ...Object.fromEntries(
            Object.entries(
              SEASON_COMPOST_REQUIREMENTS["Turbo Composter"][
                GAME_STATE.season.season
              ],
            ).map(([key, value]) => [key, new Decimal(value)]),
          ),
        },
        buildings: {
          "Turbo Composter": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              id: "0",
            },
          ],
        },
      },
      action: { type: "composter.started", building: "Turbo Composter" },
      createdAt: dateNow,
    });

    expect(result.inventory["Fruitful Blend"]).toEqual(new Decimal(10));
  });
});

describe("start Premium Composter", () => {
  const dateNow = Date.now();

  it("throws an error if Composter does not exist", () => {
    expect(() =>
      startComposter({
        state: GAME_STATE,
        action: { type: "composter.started", building: "Premium Composter" },
      }),
    ).toThrow("Composter does not exist");
  });

  it("throws an error if Premium Composter is already started", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Premium Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  items: { "Rapid Root": 10 },
                  startedAt: dateNow - 10000,
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Premium Composter" },
      }),
    ).toThrow("Composter is already composting");
  });

  it("throws an error if the user does not have the requirements", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          inventory: {},
          buildings: {
            "Premium Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Premium Composter" },
      }),
    ).toThrow("Missing requirements");
  });

  it("removes ingredients from inventory", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        ...Object.fromEntries(
          Object.entries(
            SEASON_COMPOST_REQUIREMENTS["Premium Composter"][
              GAME_STATE.season.season
            ],
          ).map(([key, value]) => [key, new Decimal(value)]),
        ),
      },
      buildings: {
        "Premium Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Premium Composter" },
    });

    const requirements =
      SEASON_COMPOST_REQUIREMENTS["Premium Composter"][
        GAME_STATE.season.season
      ];

    getKeys(requirements).forEach((itemName) => {
      expect(newState.inventory[itemName]).toEqual(new Decimal(0));
    });
  });

  it("starts ExpertComposters", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        ...Object.fromEntries(
          Object.entries(
            SEASON_COMPOST_REQUIREMENTS["Premium Composter"][
              GAME_STATE.season.season
            ],
          ).map(([key, value]) => [key, new Decimal(value)]),
        ),
      },
      buildings: {
        "Premium Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Premium Composter" },
    });

    expect(
      newState.buildings["Premium Composter"]?.[0].producing?.startedAt,
    ).toBe(dateNow);
    expect(
      newState.buildings["Premium Composter"]?.[0].producing?.readyAt,
    ).toBe(dateNow + 12 * 60 * 60 * 1000);
  });

  it("gives a 10% speed boost if the player has the Soil Krabby", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        ...Object.fromEntries(
          Object.entries(
            SEASON_COMPOST_REQUIREMENTS["Premium Composter"][
              GAME_STATE.season.season
            ],
          ).map(([key, value]) => [key, new Decimal(value)]),
        ),
      },
      buildings: {
        "Premium Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      collectibles: {
        "Soil Krabby": [
          { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
        ],
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Premium Composter" },
    });

    expect(
      newState.buildings["Premium Composter"]?.[0].producing?.readyAt,
    ).toBe(dateNow + 10.8 * 60 * 60 * 1000);
  });

  it("gives +10 Rapid Root with Premium Worms skill", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        ...Object.fromEntries(
          Object.entries(
            SEASON_COMPOST_REQUIREMENTS["Premium Composter"][
              GAME_STATE.season.season
            ],
          ).map(([key, value]) => [key, new Decimal(value)]),
        ),
      },
      buildings: {
        "Premium Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: { "Premium Worms": 1 },
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Premium Composter" },
    });

    expect(
      newState.buildings["Premium Composter"]?.[0].producing?.items[
        "Rapid Root"
      ],
    ).toBe(20);
  });

  it("does not give +10 Rapid Root with Premium Worms skill if not a Premium Composter", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Onion: new Decimal(5),
        Turnip: new Decimal(2),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: { "Premium Worms": 1 },
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Turbo Composter" },
    });

    expect(
      newState.buildings["Turbo Composter"]?.[0].producing?.items[
        "Fruitful Blend"
      ],
    ).toBe(3);

    expect(
      newState.buildings["Turbo Composter"]?.[0].producing?.items["Rapid Root"],
    ).toBeUndefined();
  });

  it("give a 10% speed boost if the player had Swift Decomposer skill", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        ...Object.fromEntries(
          Object.entries(
            SEASON_COMPOST_REQUIREMENTS["Premium Composter"][
              GAME_STATE.season.season
            ],
          ).map(([key, value]) => [key, new Decimal(value)]),
        ),
      },
      buildings: {
        "Premium Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        skills: { "Swift Decomposer": 1 },
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Premium Composter" },
    });

    expect(
      newState.buildings["Premium Composter"]?.[0].producing?.readyAt,
    ).toBe(dateNow + 10.8 * 60 * 60 * 1000);
  });

  it("gives +1 Rapid Root with Turd Topper", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Onion: new Decimal(5),
        Turnip: new Decimal(2),
      },
      wardrobe: {
        "Turd Topper": 1,
      },
      bumpkin: {
        ...INITIAL_BUMPKIN,
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          hat: "Turd Topper",
        },
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
          },
        ],
      },
    };

    const newState = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Turbo Composter" },
    });

    expect(
      newState.buildings["Turbo Composter"]?.[0].producing?.items[
        "Fruitful Blend"
      ],
    ).toBe(4);
  });
});

describe("startComposter skill ranks", () => {
  const dateNow = Date.now();

  const stateWithSkills = (
    skills: GameState["bumpkin"]["skills"],
  ): GameState => ({
    ...GAME_STATE,
    bumpkin: { ...INITIAL_BUMPKIN, skills },
  });

  it.each([
    [1, 15],
    [2, 17],
    [3, 19],
  ])("Efficient Bin rank %i gives %i Sprout Mix", (rank, expected) => {
    const { produceAmount } = getCompostAmount({
      game: stateWithSkills({ "Efficient Bin": rank }),
      building: "Compost Bin",
    });
    expect(produceAmount).toBe(expected);
  });

  it.each([
    [1, 8],
    [2, 10],
    [3, 12],
  ])("Turbo Charged rank %i gives %i Fruitful Blend", (rank, expected) => {
    const { produceAmount } = getCompostAmount({
      game: stateWithSkills({ "Turbo Charged": rank }),
      building: "Turbo Composter",
    });
    expect(produceAmount).toBe(expected);
  });

  it.each([
    [1, 20],
    [2, 25],
    [3, 30],
  ])("Premium Worms rank %i gives %i Rapid Root", (rank, expected) => {
    const { produceAmount } = getCompostAmount({
      game: stateWithSkills({ "Premium Worms": rank }),
      building: "Premium Composter",
    });
    expect(produceAmount).toBe(expected);
  });

  it.each([
    [1, 15],
    [2, 18],
    [3, 20],
  ])("Composting Revamp rank %i gives %i Sprout Mix", (rank, expected) => {
    const { produceAmount } = getCompostAmount({
      game: stateWithSkills({ "Composting Revamp": rank }),
      building: "Compost Bin",
    });
    expect(produceAmount).toBe(expected);
  });

  it.each([
    [1, 0.9],
    [2, 0.875],
    [3, 0.85],
  ])("Swift Decomposer rank %i multiplies compost time by %f", (rank, mult) => {
    const { timeToFinishMilliseconds } = getReadyAt({
      gameState: stateWithSkills({ "Swift Decomposer": rank }),
      composter: "Compost Bin",
    });
    expect(timeToFinishMilliseconds).toBe(
      composterDetails["Compost Bin"].timeToFinishMilliseconds * mult,
    );
  });

  it("snapshots the compost amount at the rank paid for when production starts", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Potato: new Decimal(10),
        Cabbage: new Decimal(3),
      },
      buildings: {
        "Compost Bin": [
          { coordinates: { x: 0, y: 0 }, createdAt: 0, readyAt: 0, id: "0" },
        ],
      },
      bumpkin: { ...INITIAL_BUMPKIN, skills: { "Efficient Bin": 1 } },
    };

    const started = startComposter({
      createdAt: dateNow,
      state,
      action: { type: "composter.started", building: "Compost Bin" },
    });

    // Ranking up mid-production must not retroactively change the output.
    const rankedUp: GameState = {
      ...started,
      bumpkin: { ...started.bumpkin, skills: { "Efficient Bin": 3 } },
    };

    expect(
      rankedUp.buildings["Compost Bin"]?.[0].producing?.items["Sprout Mix"],
    ).toBe(15);
  });
});
