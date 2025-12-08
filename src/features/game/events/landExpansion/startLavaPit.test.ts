import Decimal from "decimal.js-light";
import {
  LAVA_PIT_TIME,
  getLavaPitRequirements,
  startLavaPit,
} from "./startLavaPit";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

import * as config from "lib/config";

const TEST_FARM: GameState = {
  ...INITIAL_FARM,
  inventory: {
    ...INITIAL_FARM.inventory,
    Oil: new Decimal(70),
    Pepper: new Decimal(750),
    Zucchini: new Decimal(1000),
    Crimstone: new Decimal(4),
  },
  season: {
    season: "summer",
    startedAt: 0,
  },
};

describe("getLavaPitRequirements", () => {
  const NOVEMBER_10_2025 = new Date("2025-11-10T00:00:00.000Z").getTime();

  it("uses the old requirements before the migration date", () => {
    const { requirements, boostUsed } = getLavaPitRequirements(
      {
        ...TEST_FARM,
        season: {
          ...TEST_FARM.season,
          season: "summer",
        },
      },
      NOVEMBER_10_2025 - 1,
    );

    expect(requirements).toEqual({
      Oil: new Decimal(100),
      Pepper: new Decimal(750),
      Zucchini: new Decimal(1000),
    });
    expect(boostUsed).toEqual([]);
  });

  it("uses the new requirements from the migration date", () => {
    const { requirements, boostUsed } = getLavaPitRequirements(
      TEST_FARM,
      NOVEMBER_10_2025,
    );

    expect(requirements).toEqual({
      Oil: new Decimal(70),
      Pepper: new Decimal(750),
      Zucchini: new Decimal(1000),
      Crimstone: new Decimal(4),
    });
    expect(boostUsed).toEqual([]);
  });

  it("applies lava swimwear without mutating the base requirements", () => {
    const createdAt = NOVEMBER_10_2025;

    const swimwearGame: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...TEST_FARM.bumpkin,
        equipped: {
          ...TEST_FARM.bumpkin.equipped,
          dress: "Lava Swimwear",
        },
      },
    };

    const withoutSwimwear: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...TEST_FARM.bumpkin,
        equipped: {
          ...TEST_FARM.bumpkin.equipped,
          dress: undefined,
        },
      },
    };

    const swimwearRequirements = getLavaPitRequirements(
      swimwearGame,
      createdAt,
    );

    expect(swimwearRequirements.requirements).toEqual({
      Oil: new Decimal(35),
      Pepper: new Decimal(375),
      Zucchini: new Decimal(500),
      Crimstone: new Decimal(2),
    });
    expect(swimwearRequirements.boostUsed).toEqual(["Lava Swimwear"]);

    const defaultRequirements = getLavaPitRequirements(
      withoutSwimwear,
      createdAt,
    );

    expect(defaultRequirements.requirements).toEqual({
      Oil: new Decimal(70),
      Pepper: new Decimal(750),
      Zucchini: new Decimal(1000),
      Crimstone: new Decimal(4),
    });
    expect(defaultRequirements.boostUsed).toEqual([]);
  });
});

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

    expect(result.inventory.Oil).toEqual(new Decimal(35));
    expect(result.inventory.Pepper).toEqual(new Decimal(375));
    expect(result.inventory.Zucchini).toEqual(new Decimal(500));
    expect(result.inventory.Crimstone).toEqual(new Decimal(2));
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
    expect(result.lavaPits[1].readyAt).toEqual(now + LAVA_PIT_TIME * 0.5);
  });

  it("starts the lava pit with magma stone placed", () => {
    const result = startLavaPit({
      state: {
        ...TEST_FARM,
        lavaPits: { 1: { x: 0, y: 0, createdAt: 0 } },
        collectibles: {
          "Magma Stone": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: now,
              createdAt: now,
            },
          ],
        },
      },
      action: { type: "lavaPit.started", id: "1" },
      createdAt: now,
    });

    expect(result.lavaPits[1].startedAt).toEqual(now);
    expect(result.lavaPits[1].readyAt).toEqual(now + LAVA_PIT_TIME * 0.85);
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
