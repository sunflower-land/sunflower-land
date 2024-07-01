import Decimal from "decimal.js-light";
import { startComposter } from "./startComposter";
import { GameState } from "features/game/types/game";
import { TEST_FARM } from "features/game/lib/constants";

const GAME_STATE: GameState = TEST_FARM;

describe("start Compost Bin", () => {
  const dateNow = Date.now();

  it("throws an error if Composter does not exist", () => {
    expect(() =>
      startComposter({
        state: GAME_STATE,
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
                requires: {
                  Kale: 50,
                },
                producing: {
                  items: { "Sprout Mix": 10 },
                  startedAt: dateNow - 10000,
                  readyAt: dateNow - 1000,
                },
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
        Sunflower: new Decimal(5),
        Pumpkin: new Decimal(3),
        Carrot: new Decimal(2),
      },
      buildings: {
        "Compost Bin": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            requires: {
              Sunflower: 5,
              Pumpkin: 3,
              Carrot: 2,
            },
            producing: {
              items: { "Sprout Mix": 10 },
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
          },
        ],
      },
    };

    const newState = startComposter({
      state,
      action: { type: "composter.started", building: "Compost Bin" },
    });

    expect(newState.inventory.Sunflower).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Pumpkin).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Carrot).toStrictEqual(new Decimal(0));
  });

  it("starts BasicComposters", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Sunflower: new Decimal(5),
        Pumpkin: new Decimal(3),
        Carrot: new Decimal(2),
      },
      buildings: {
        "Compost Bin": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            requires: {
              Sunflower: 5,
              Pumpkin: 3,
              Carrot: 2,
            },
            producing: {
              items: { "Sprout Mix": 10 },
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
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
        Sunflower: new Decimal(5),
        Pumpkin: new Decimal(3),
        Carrot: new Decimal(2),
      },
      buildings: {
        "Compost Bin": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            requires: {
              Sunflower: 5,
              Pumpkin: 3,
              Carrot: 2,
            },
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
                requires: {
                  Kale: 50,
                },
                producing: {
                  items: { "Fruitful Blend": 10 },
                  startedAt: dateNow - 10000,
                  readyAt: dateNow - 1000,
                },
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
        Cauliflower: new Decimal(5),
        Egg: new Decimal(1),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            requires: {
              Cauliflower: 3,
              Egg: 1,
            },
            producing: {
              items: { "Fruitful Blend": 10 },
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
          },
        ],
      },
    };

    const newState = startComposter({
      state,
      action: { type: "composter.started", building: "Turbo Composter" },
    });

    expect(newState.inventory.Cauliflower).toStrictEqual(new Decimal(2));
    expect(newState.inventory.Egg).toStrictEqual(new Decimal(0));
  });

  it("starts Turbo Composters", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Cauliflower: new Decimal(5),
        Egg: new Decimal(1),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            requires: {
              Cauliflower: 5,
              Egg: 1,
            },
            producing: {
              items: { "Fruitful Blend": 10 },
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
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
        Sunflower: new Decimal(5),
        Pumpkin: new Decimal(3),
        Carrot: new Decimal(2),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            requires: {
              Sunflower: 5,
              Pumpkin: 3,
              Carrot: 2,
            },
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
                requires: { Kale: 1 },
                producing: {
                  items: { "Rapid Root": 10 },
                  startedAt: dateNow - 10000,
                  readyAt: dateNow - 1000,
                },
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
        Radish: new Decimal(2),
        Parsnip: new Decimal(2),
      },
      buildings: {
        "Premium Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            requires: {
              Radish: 2,
              Parsnip: 2,
            },
            producing: {
              items: { "Rapid Root": 10 },
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
          },
        ],
      },
    };

    const newState = startComposter({
      state,
      action: { type: "composter.started", building: "Premium Composter" },
    });

    expect(newState.inventory.Radish).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Parsnip).toStrictEqual(new Decimal(0));
  });

  it("starts ExpertComposters", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Radish: new Decimal(2),
        Parsnip: new Decimal(2),
      },
      buildings: {
        "Premium Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            requires: {
              Radish: 2,
              Parsnip: 2,
            },
            producing: {
              items: { "Rapid Root": 10 },
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
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
        Sunflower: new Decimal(5),
        Pumpkin: new Decimal(3),
        Carrot: new Decimal(2),
      },
      buildings: {
        "Premium Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            requires: {
              Sunflower: 5,
              Pumpkin: 3,
              Carrot: 2,
            },
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
});
