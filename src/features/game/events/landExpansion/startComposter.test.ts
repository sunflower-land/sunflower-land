import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { startComposter } from "./startComposter";

const GAME_STATE: GameState = TEST_FARM;

describe("start Compost Bin", () => {
  const dateNow = Date.now();

  it("throws an error if Composter does not exist", () => {
    expect(() =>
      startComposter({
        state: GAME_STATE,
        action: { type: "composter.started", building: "Compost Bin" },
      })
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
                  name: "Sprout Mix",
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Compost Bin" },
      })
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
                producing: {
                  name: "Sprout Mix",
                  readyAt: dateNow - 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Compost Bin" },
      })
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
            producing: {
              name: "Sprout Mix",
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
            producing: {
              name: "Sprout Mix",
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

    expect(newState.buildings["Compost Bin"]?.[0].producing?.readyAt).toBe(
      dateNow + 6 * 60 * 60 * 1000
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
      })
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
                  name: "Fruitful Blend",
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Turbo Composter" },
      })
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
                producing: {
                  name: "Fruitful Blend",
                  readyAt: dateNow - 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Turbo Composter" },
      })
    ).toThrow("Missing requirements");
  });

  it("removes ingredients from inventory", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Kale: new Decimal(5),
        Egg: new Decimal(1),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Fruitful Blend",
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

    expect(newState.inventory.Kale).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Egg).toStrictEqual(new Decimal(0));
  });

  it("starts AdvancedComposters", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Kale: new Decimal(5),
        Egg: new Decimal(1),
      },
      buildings: {
        "Turbo Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Fruitful Blend",
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

    expect(newState.buildings["Turbo Composter"]?.[0].producing?.readyAt).toBe(
      dateNow + 8 * 60 * 60 * 1000
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
      })
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
                  name: "Rapid Root",
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Premium Composter" },
      })
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
                producing: {
                  name: "Rapid Root",
                  readyAt: dateNow - 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Premium Composter" },
      })
    ).toThrow("Missing requirements");
  });

  it("removes ingredients from inventory", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Orange: new Decimal(2),
        Blueberry: new Decimal(2),
        Egg: new Decimal(3),
      },
      buildings: {
        "Premium Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Rapid Root",
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

    expect(newState.inventory.Orange).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Blueberry).toStrictEqual(new Decimal(0));
    expect(newState.inventory.Egg).toStrictEqual(new Decimal(0));
  });

  it("starts ExpertComposters", () => {
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Orange: new Decimal(2),
        Blueberry: new Decimal(2),
        Egg: new Decimal(3),
      },
      buildings: {
        "Premium Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Rapid Root",
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
      newState.buildings["Premium Composter"]?.[0].producing?.readyAt
    ).toBe(dateNow + 12 * 60 * 60 * 1000);
  });
});
