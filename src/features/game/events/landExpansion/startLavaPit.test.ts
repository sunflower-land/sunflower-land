import Decimal from "decimal.js-light";
import { startLavaPit } from "./startLavaPit";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

import * as config from "lib/config";

const TEST_FARM: GameState = {
  ...INITIAL_FARM,
  inventory: {
    ...INITIAL_FARM.inventory,
    Oil: new Decimal(100),
    Pepper: new Decimal(750),
    Zucchini: new Decimal(1000),
  },
  season: {
    season: "summer",
    startedAt: 0,
  },
};

describe("startLavaPit", () => {
  const spy = jest.spyOn((config as any).default, "CONFIG", "get");

  beforeEach(() => {
    jest.clearAllMocks();
  });
  const now = Date.now();

  it("requires the lava pit to exist", () => {
    expect(() =>
      startLavaPit({
        state: INITIAL_FARM,
        action: { type: "lavaPit.started", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit not found");
  });

  it("requires the lava pit to be placed", () => {
    expect(() =>
      startLavaPit({
        state: {
          ...TEST_FARM,
          lavaPits: {
            1: { x: undefined, y: undefined, createdAt: 0 },
          },
        },
        action: { type: "lavaPit.started", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit is not placed");
  });

  it("requires resources to start", () => {
    expect(() =>
      startLavaPit({
        state: {
          ...TEST_FARM,
          inventory: {},
          lavaPits: {
            1: { x: 0, y: 0, createdAt: 0 },
          },
        },
        action: { type: "lavaPit.started", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Required resource Oil not found");
  });

  it("subtracts the required resources", () => {
    const result = startLavaPit({
      state: {
        ...TEST_FARM,
        lavaPits: {
          1: { x: 0, y: 0, createdAt: 0 },
        },
      },
      action: { type: "lavaPit.started", id: "1" },
      createdAt: now,
    });

    expect(result.inventory.Oil).toEqual(new Decimal(0));
  });

  it("subtracts the required resources with lava swimwear", () => {
    const result = startLavaPit({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...TEST_FARM.bumpkin,
          equipped: {
            ...TEST_FARM.bumpkin.equipped,
            dress: "Lava Swimwear",
          },
        },
        lavaPits: {
          1: { x: 0, y: 0, createdAt: 0 },
        },
      },
      action: { type: "lavaPit.started", id: "1" },
      createdAt: now,
    });

    expect(result.inventory.Oil).toEqual(new Decimal(50));
    expect(result.inventory.Pepper).toEqual(new Decimal(375));
    expect(result.inventory.Zucchini).toEqual(new Decimal(500));
  });

  it("starts the lava pit", () => {
    const result = startLavaPit({
      state: {
        ...TEST_FARM,
        lavaPits: { 1: { x: 0, y: 0, createdAt: 0 } },
      },
      action: { type: "lavaPit.started", id: "1" },
      createdAt: now,
    });

    expect(result.lavaPits[1].startedAt).toEqual(now);
    expect(result.lavaPits[1].readyAt).toEqual(now + 72 * 60 * 60 * 1000);
  });

  it("starts the lava pit with obsidian necklace", () => {
    const result = startLavaPit({
      state: {
        ...TEST_FARM,
        wardrobe: {
          "Obsidian Necklace": 1,
        },
        lavaPits: { 1: { x: 0, y: 0, createdAt: 0 } },
        bumpkin: {
          ...TEST_FARM.bumpkin,
          equipped: {
            ...TEST_FARM.bumpkin.equipped,
            necklace: "Obsidian Necklace",
          },
        },
      },
      action: { type: "lavaPit.started", id: "1" },
      createdAt: now,
    });

    expect(result.lavaPits[1].startedAt).toEqual(now);
    expect(result.lavaPits[1].readyAt).toEqual(now + 36 * 60 * 60 * 1000);
  });

  it("does not start the lava pit if it is already started", () => {
    expect(() =>
      startLavaPit({
        state: {
          ...TEST_FARM,
          lavaPits: {
            1: {
              x: 0,
              y: 0,
              startedAt: now,
              createdAt: 0,
            },
          },
        },
        action: { type: "lavaPit.started", id: "1" },
        createdAt: now,
      }),
    ).toThrow("Lava pit already started");
  });

  it("unsets the collectedAt", () => {
    const result = startLavaPit({
      state: {
        ...TEST_FARM,
        lavaPits: {
          1: { x: 0, y: 0, createdAt: 0, collectedAt: 1 },
        },
      },
      action: { type: "lavaPit.started", id: "1" },
      createdAt: now,
    });

    expect(result.lavaPits[1].collectedAt).toBeUndefined();
  });
});
