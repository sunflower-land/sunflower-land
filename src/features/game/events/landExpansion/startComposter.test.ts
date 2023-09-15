import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { startComposter } from "./startComposter";

const GAME_STATE: GameState = TEST_FARM;

describe("start Basic Composter", () => {
  const dateNow = Date.now();

  it("throws an error if Composter does not exist", () => {
    expect(() =>
      startComposter({
        state: GAME_STATE,
        action: { type: "composter.started", building: "Basic Composter" },
      })
    ).toThrow("Composter does not exist");
  });

  it("throws an error if Basic Composter is already started", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Basic Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  name: "Earthworm",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Basic Composter" },
      })
    ).toThrow("Composter is already composting");
  });

  it("throws an error if the user does not have the requirements", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Basic Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  name: "Earthworm",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow - 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Basic Composter" },
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
        "Basic Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Earthworm",
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
          },
        ],
      },
    };

    const newState = startComposter({
      state,
      action: { type: "composter.started", building: "Basic Composter" },
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
        "Basic Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Earthworm",
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
      action: { type: "composter.started", building: "Basic Composter" },
    });

    expect(
      newState.buildings["Basic Composter"]?.[0].producing?.startedAt
    ).toBe(dateNow);
    expect(newState.buildings["Basic Composter"]?.[0].producing?.readyAt).toBe(
      dateNow + 6 * 60 * 60 * 1000
    );
  });
});

describe("start Advanced Composter", () => {
  const dateNow = Date.now();

  it("throws an error if Composter does not exist", () => {
    expect(() =>
      startComposter({
        state: GAME_STATE,
        action: { type: "composter.started", building: "Advanced Composter" },
      })
    ).toThrow("Composter does not exist");
  });

  it("throws an error if Advanced Composter is already started", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Advanced Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  name: "Grub",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Advanced Composter" },
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
            "Advanced Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  name: "Grub",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow - 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Advanced Composter" },
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
        "Advanced Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Grub",
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
          },
        ],
      },
    };

    const newState = startComposter({
      state,
      action: { type: "composter.started", building: "Advanced Composter" },
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
        "Advanced Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Grub",
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
      action: { type: "composter.started", building: "Advanced Composter" },
    });

    expect(
      newState.buildings["Advanced Composter"]?.[0].producing?.startedAt
    ).toBe(dateNow);
    expect(
      newState.buildings["Advanced Composter"]?.[0].producing?.readyAt
    ).toBe(dateNow + 8 * 60 * 60 * 1000);
  });
});

describe("start Expert Composter", () => {
  const dateNow = Date.now();

  it("throws an error if Composter does not exist", () => {
    expect(() =>
      startComposter({
        state: GAME_STATE,
        action: { type: "composter.started", building: "Expert Composter" },
      })
    ).toThrow("Composter does not exist");
  });

  it("throws an error if Expert Composter is already started", () => {
    expect(() =>
      startComposter({
        state: {
          ...GAME_STATE,
          buildings: {
            "Expert Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  name: "Red Wiggler",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow + 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Expert Composter" },
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
            "Expert Composter": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                id: "0",
                producing: {
                  name: "Red Wiggler",
                  startedAt: dateNow - 10000,
                  readyAt: dateNow - 1000,
                },
              },
            ],
          },
        },
        action: { type: "composter.started", building: "Expert Composter" },
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
        "Expert Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Red Wiggler",
              startedAt: dateNow - 10000,
              readyAt: dateNow - 1000,
            },
          },
        ],
      },
    };

    const newState = startComposter({
      state,
      action: { type: "composter.started", building: "Expert Composter" },
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
        "Expert Composter": [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            id: "0",
            producing: {
              name: "Red Wiggler",
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
      action: { type: "composter.started", building: "Expert Composter" },
    });

    expect(
      newState.buildings["Expert Composter"]?.[0].producing?.startedAt
    ).toBe(dateNow);
    expect(newState.buildings["Expert Composter"]?.[0].producing?.readyAt).toBe(
      dateNow + 12 * 60 * 60 * 1000
    );
  });
});
