import Decimal from "decimal.js-light";
import {
  TEST_FARM,
  INITIAL_BUMPKIN,
  INITIAL_FARM,
  SUNSTONE_RECOVERY_TIME,
} from "../../lib/constants";
import type { GameState, FiniteResource } from "../../types/game";
import {
  EVENT_ERRORS,
  type MineSunstoneAction,
  mineSunstone,
} from "./mineSunstone";
import { CONFIG } from "lib/config";
import { getMineReadyAt } from "features/game/lib/resourceNodes";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  sunstones: {
    0: {
      stone: {
        minedAt: 0,
      },
      minesLeft: 10,
      x: 1,
      y: 1,
    },
    1: {
      stone: {
        minedAt: 0,
      },
      minesLeft: 1,
      x: 4,
      y: 1,
    },
  },
};

describe("mineSunstone", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  it("throws an error if sunstone does not exist", () => {
    expect(() =>
      mineSunstone({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: {
            "Gold Pickaxe": new Decimal(2),
          },
        },
        createdAt: Date.now(),
        action: {
          type: "sunstoneRock.mined",
          index: "3",
        },
      }),
    ).toThrow(EVENT_ERRORS.NO_SUNSTONE);
  });

  it("throws an error if sunstone is not placed", () => {
    expect(() =>
      mineSunstone({
        state: {
          ...GAME_STATE,
          bumpkin: GAME_STATE.bumpkin,
          sunstones: {
            0: { ...GAME_STATE.sunstones[0], x: undefined, y: undefined },
          },
        },
        action: { type: "sunstoneRock.mined", index: "0" },
        createdAt: Date.now(),
      }),
    ).toThrow("Sunstone rock is not placed");
  });

  it("throws an error if no gold pickaxes are left", () => {
    expect(() =>
      mineSunstone({
        state: {
          ...GAME_STATE,
          bumpkin: INITIAL_BUMPKIN,
          inventory: { "Gold Pickaxe": new Decimal(0) },
        },
        createdAt: Date.now(),
        action: {
          type: "sunstoneRock.mined",
          index: "0",
        },
      }),
    ).toThrow(EVENT_ERRORS.NO_PICKAXES);
  });

  it("mines sunstone", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Gold Pickaxe": new Decimal(1),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "sunstoneRock.mined",

        index: "0",
      } as MineSunstoneAction,
    };

    const game = mineSunstone(payload);

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Sunstone).toEqual(new Decimal(1));
    expect(game.sunstones["0"].minesLeft).toEqual(9);
  });

  it("mines sunstone for the last time", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: {
          "Gold Pickaxe": new Decimal(1),
          "Sunstone Rock": new Decimal(2),
        },
      },
      createdAt: Date.now(),
      action: {
        type: "sunstoneRock.mined",

        index: "1",
      } as MineSunstoneAction,
    };

    const game = mineSunstone(payload);

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Sunstone).toEqual(new Decimal(1));
    expect(game.sunstones["1"]).toBeUndefined();
    expect(game.inventory["Sunstone Rock"]).toEqual(new Decimal(1));
  });

  describe("BumpkinActivity", () => {
    it("increments Sunstone mined activity by 1", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
      };
      const game = mineSunstone({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Gold Pickaxe": new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "sunstoneRock.mined",
          index: "0",
        } as MineSunstoneAction,
      });

      expect(game.farmActivity["Sunstone Mined"]).toBe(1);
    });

    it("increments Sunstone Mined activity by 2", () => {
      const createdAt = Date.now();
      const bumpkin = {
        ...INITIAL_BUMPKIN,
      };
      const state1 = mineSunstone({
        state: {
          ...GAME_STATE,
          bumpkin: bumpkin,
          inventory: {
            "Gold Pickaxe": new Decimal(3),
          },
        },
        createdAt,
        action: {
          type: "sunstoneRock.mined",
          index: "0",
        } as MineSunstoneAction,
      });

      const game = mineSunstone({
        state: state1,
        createdAt,
        action: {
          type: "sunstoneRock.mined",
          index: "1",
        } as MineSunstoneAction,
      });

      expect(game.farmActivity["Sunstone Mined"]).toBe(2);
    });
  });
});

describe("mineSunstone — SPEED_BOOSTS speed windows", () => {
  const now = Date.now();
  const BASE_MS = SUNSTONE_RECOVERY_TIME * 1000;
  const originalNetwork = CONFIG.NETWORK;

  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  it("stores the real mine time + base recovery (no back-dating), no boosts", () => {
    const game = mineSunstone({
      state: {
        ...GAME_STATE,
        bumpkin: INITIAL_BUMPKIN,
        inventory: { "Gold Pickaxe": new Decimal(1) },
      },
      createdAt: now,
      action: { type: "sunstoneRock.mined", index: "0" },
    });

    expect(game.sunstones[0].stone.minedAt).toEqual(now);
    expect(game.sunstones[0].stone.baseDurationMs).toEqual(BASE_MS);
  });

  it("has no temporary recovery boost — totems/hourglass/shrines do not speed it up", () => {
    const rock: FiniteResource = {
      stone: { minedAt: now, baseDurationMs: BASE_MS },
      x: 1,
      y: 1,
      minesLeft: 10,
    };
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Super Totem": [
          {
            id: "1",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
        "Time Warp Totem": [
          {
            id: "2",
            createdAt: now,
            coordinates: { x: 2, y: 2 },
            readyAt: now,
          },
        ],
        "Ore Hourglass": [
          {
            id: "3",
            createdAt: now,
            coordinates: { x: 3, y: 3 },
            readyAt: now,
          },
        ],
        "Mole Shrine": [
          {
            id: "4",
            createdAt: now,
            coordinates: { x: 4, y: 4 },
            readyAt: now,
          },
        ],
        "Badger Shrine": [
          {
            id: "5",
            createdAt: now,
            coordinates: { x: 5, y: 5 },
            readyAt: now,
          },
        ],
      },
    };

    // Empty window set → readiness is just minedAt + baseDurationMs.
    expect(getMineReadyAt(rock, "Sunstone Rock", game)).toEqual(now + BASE_MS);
  });

  it("falls back to base recovery for a legacy rock (no baseDurationMs)", () => {
    const rock: FiniteResource = {
      stone: { minedAt: now },
      x: 1,
      y: 1,
      minesLeft: 10,
    };
    expect(getMineReadyAt(rock, "Sunstone Rock", INITIAL_FARM)).toEqual(
      now + BASE_MS,
    );
  });
});

describe("getMineReadyAt — baseDurationMs is a permanent per-rock marker (sunstone)", () => {
  const now = Date.now();
  const BASE_MS = SUNSTONE_RECOVERY_TIME * 1000;
  const originalNetwork = CONFIG.NETWORK;

  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  it("keeps using baseDurationMs with SPEED_BOOSTS off (no rollback to full base)", () => {
    const rock: FiniteResource = {
      stone: { minedAt: now, baseDurationMs: BASE_MS / 2 },
      x: 1,
      y: 1,
      minesLeft: 10,
    };

    expect(getMineReadyAt(rock, "Sunstone Rock", INITIAL_FARM)).toEqual(
      now + BASE_MS / 2,
    );
  });
});
