import Decimal from "decimal.js-light";
import {
  TEST_FARM,
  INITIAL_BUMPKIN,
  CRIMSTONE_RECOVERY_TIME,
  INITIAL_FARM,
} from "../../lib/constants";
import type { GameState, FiniteResource } from "../../types/game";
import {
  type MineCrimstoneAction,
  getMinedAt,
  mineCrimstone,
} from "./mineCrimstone";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";
import { CONFIG } from "lib/config";
import { getMineReadyAt } from "features/game/lib/resourceNodes";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  crimstones: {
    0: {
      stone: {
        minedAt: 0,
      },
      x: 1,
      y: 1,
      minesLeft: 5,
    },
    1: {
      stone: {
        minedAt: 0,
      },
      x: 4,
      y: 1,
      minesLeft: 5,
    },
  },
};
const FARM_ID = 1;

describe("mineCrimstone", () => {
  // These tests assert the LEGACY back-dated recovery (the discount is baked into
  // minedAt at mine time). FE jest runs on amoy where SPEED_BOOSTS is on, so
  // force the flag off here; the windowed model is covered in its own describe.
  const originalNetwork = CONFIG.NETWORK;
  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  it("throws an error if no gold pickaxes are left", () => {
    expect(() =>
      mineCrimstone({
        state: {
          ...GAME_STATE,
          inventory: {
            "Gold Pickaxe": new Decimal(0),
          },
        },
        action: {
          type: "crimstoneRock.mined",
          index: 0,
        },
        farmId: FARM_ID,
      }),
    ).toThrow("No gold pickaxes left");
  });

  it("mines crimstone for free with Crimstone Spikes Hair", () => {
    const game = mineCrimstone({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hair: "Crimstone Spikes Hair",
          },
        },
        inventory: {
          "Gold Pickaxe": new Decimal(0),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        index: 0,
      },
      farmId: FARM_ID,
    });

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Crimstone).toEqual(new Decimal(1));
  });

  it("throws an error if crimstone does not exist", () => {
    expect(() =>
      mineCrimstone({
        state: {
          ...GAME_STATE,
          inventory: {
            "Gold Pickaxe": new Decimal(2),
          },
        },
        action: {
          type: "crimstoneRock.mined",
          index: 3,
        },
        farmId: FARM_ID,
      }),
    ).toThrow("Crimstone does not exist");
  });

  it("throws an error if crimstone is not placed", () => {
    expect(() =>
      mineCrimstone({
        state: {
          ...GAME_STATE,
          bumpkin: GAME_STATE.bumpkin,
          crimstones: {
            0: { ...GAME_STATE.crimstones[0], x: undefined, y: undefined },
          },
        },
        action: { type: "crimstoneRock.mined", index: 0 },
        farmId: FARM_ID,
      }),
    ).toThrow("Crimstone rock is not placed");
  });

  it("throws an error if crimstone is not ready", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    };
    const game = mineCrimstone(payload);

    // Try same payload
    expect(() =>
      mineCrimstone({
        state: game,
        action: payload.action,
        farmId: FARM_ID,
      }),
    ).toThrow("Rock is still recovering");
  });

  it("mines crimstone", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(1),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    };

    const game = mineCrimstone(payload);

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Crimstone).toEqual(new Decimal(1));
  });

  it("mines multiple crimstones", () => {
    let game = mineCrimstone({
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(3),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    });

    game = mineCrimstone({
      state: game,
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 1,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    });

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(1));
    expect(game.inventory.Crimstone).toEqual(new Decimal(2));
  });

  it("mines crimstone after waiting", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 0,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    };

    let game = mineCrimstone(payload);

    // 24 hours + 100 milliseconds
    game = mineCrimstone({
      createdAt: Date.now() + 1 * 24 * 60 * 60 * 1000 + 100,
      ...payload,
      state: game,
    });

    expect(game.inventory["Gold Pickaxe"]).toEqual(new Decimal(0));
    expect(game.inventory.Crimstone?.toNumber()).toEqual(2);
  });

  it("resets minesLeft after 24 hours", () => {
    const payload = {
      state: {
        ...GAME_STATE,
        inventory: {
          "Gold Pickaxe": new Decimal(2),
        },
      },
      action: {
        type: "crimstoneRock.mined",
        expansionIndex: 0,
        index: 1,
      } as MineCrimstoneAction,
      farmId: FARM_ID,
    };

    let game = mineCrimstone(payload);

    // 48 hours + 100 milliseconds
    game = mineCrimstone({
      createdAt: Date.now() + 2 * 24 * 60 * 60 * 1000 + 100,
      ...payload,
      state: game,
    });

    expect(game.crimstones[1].minesLeft).toEqual(4);
  });

  describe("getMinedAt", () => {
    it("crimstone replenishes faster with Crimstone Amulet", () => {
      const now = Date.now();

      const { time } = getMinedAt({
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            equipped: {
              ...INITIAL_BUMPKIN.equipped,
              necklace: "Crimstone Amulet",
            },
          },
        },
        createdAt: now,
        prngArgs: {
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Crimstone Rock"],
          counter: 0,
        },
      });

      expect(time).toEqual(now - CRIMSTONE_RECOVERY_TIME * 0.2 * 1000);
    });
    it("crimstone replenishes faster with Fireside Alchemist", () => {
      const now = Date.now();

      const { time } = getMinedAt({
        game: {
          ...GAME_STATE,
          bumpkin: {
            ...GAME_STATE.bumpkin,
            skills: {
              "Fireside Alchemist": 1,
            },
          },
        },
        createdAt: now,
        prngArgs: {
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Crimstone Rock"],
          counter: 0,
        },
      });

      expect(time).toEqual(now - CRIMSTONE_RECOVERY_TIME * 0.15 * 1000);
    });

    it("crimstone replenishes faster with Fireside Alchemist, Crimstone Amulet and Mole Shrine", () => {
      const now = Date.now();

      const { time } = getMinedAt({
        game: {
          ...GAME_STATE,
          bumpkin: {
            ...GAME_STATE.bumpkin,
            skills: {
              "Fireside Alchemist": 1,
            },
            equipped: {
              ...GAME_STATE.bumpkin.equipped,
              necklace: "Crimstone Amulet",
            },
          },
          collectibles: {
            "Mole Shrine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: now,
                id: "12",
                readyAt: now,
              },
            ],
          },
        },
        createdAt: now,
        prngArgs: {
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Crimstone Rock"],
          counter: 0,
        },
      });

      const expectedCooldownTime =
        CRIMSTONE_RECOVERY_TIME - CRIMSTONE_RECOVERY_TIME * 0.8 * 0.85 * 0.75;

      expect(time).toEqual(now - expectedCooldownTime * 1000);
    });

    it("crimstone replenishes faster with Crimstone Clam", () => {
      const now = Date.now();

      const { time } = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Crimstone Clam": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: now,
                id: "clam",
                readyAt: now,
              },
            ],
          },
        },
        createdAt: now,
        prngArgs: {
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Crimstone Rock"],
          counter: 0,
        },
      });

      expect(time).toEqual(now - CRIMSTONE_RECOVERY_TIME * 0.1 * 1000);
    });

    it("instantly respawns with Crimstone Clam", () => {
      const now = Date.now();

      function getCounter() {
        let counter = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          if (
            prngChance({
              farmId: FARM_ID,
              itemId: KNOWN_IDS["Crimstone Rock"],
              counter,
              chance: 10,
              criticalHitName: "Crimstone Clam",
            })
          ) {
            return counter;
          }
          counter++;
        }
      }

      const counter = getCounter();

      const { time } = getMinedAt({
        game: {
          ...TEST_FARM,
          collectibles: {
            "Crimstone Clam": [
              {
                coordinates: { x: 1, y: 1 },
                createdAt: now,
                id: "clam",
                readyAt: now,
              },
            ],
          },
        },
        createdAt: now,
        prngArgs: {
          farmId: FARM_ID,
          itemId: KNOWN_IDS["Crimstone Rock"],
          counter,
        },
      });

      expect(time).toEqual(now - CRIMSTONE_RECOVERY_TIME * 1000);
    });
  });
});

describe("mineCrimstone — SPEED_BOOSTS speed windows", () => {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const BASE_MS = CRIMSTONE_RECOVERY_TIME * 1000;
  const originalNetwork = CONFIG.NETWORK;

  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  const baseState: GameState = {
    ...GAME_STATE,
    inventory: { "Gold Pickaxe": new Decimal(1) },
    crimstones: {
      0: { stone: { minedAt: 0 }, x: 1, y: 1, minesLeft: 5 },
    },
  };

  const mineFirstCrimstone = (state: GameState) =>
    mineCrimstone({
      state,
      createdAt: now,
      action: { type: "crimstoneRock.mined", index: 0 },
      farmId: FARM_ID,
    });

  it("stores the real mine time + base recovery (no back-dating) with no boosts", () => {
    const game = mineFirstCrimstone(baseState);

    expect(game.crimstones[0].stone.minedAt).toEqual(now);
    expect(game.crimstones[0].stone.baseDurationMs).toEqual(BASE_MS);
  });

  it("folds a permanent Crimstone Amulet boost into baseDurationMs, not back-dating", () => {
    const game = mineFirstCrimstone({
      ...baseState,
      bumpkin: {
        ...baseState.bumpkin,
        equipped: {
          ...baseState.bumpkin.equipped,
          necklace: "Crimstone Amulet",
        },
      },
    });

    expect(game.crimstones[0].stone.minedAt).toEqual(now);
    expect(game.crimstones[0].stone.baseDurationMs).toEqual(BASE_MS * 0.8);
  });

  it("folds a permanent Fireside Alchemist boost into baseDurationMs", () => {
    const game = mineFirstCrimstone({
      ...baseState,
      bumpkin: {
        ...baseState.bumpkin,
        skills: { "Fireside Alchemist": 1 },
      },
    });

    expect(game.crimstones[0].stone.minedAt).toEqual(now);
    expect(game.crimstones[0].stone.baseDurationMs).toEqual(BASE_MS * 0.85);
  });

  it("excludes a temporary Mole Shrine from baseDurationMs (applied as a window)", () => {
    const game = mineFirstCrimstone({
      ...baseState,
      collectibles: {
        "Mole Shrine": [
          {
            id: "1",
            createdAt: now - 100,
            coordinates: { x: 1, y: 1 },
            readyAt: now - 100,
          },
        ],
      },
    });

    // Not reduced — derived live over the recovery instead.
    expect(game.crimstones[0].stone.minedAt).toEqual(now);
    expect(game.crimstones[0].stone.baseDurationMs).toEqual(BASE_MS);
  });

  it("recovers 1.35× faster with an active Mole Shrine (getMineReadyAt)", () => {
    const rock: FiniteResource = {
      stone: { minedAt: now, baseDurationMs: BASE_MS },
      x: 1,
      y: 1,
      minesLeft: 5,
    };
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Mole Shrine": [
          {
            id: "1",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
      },
    };

    expect(getMineReadyAt(rock, "Crimstone Rock", game)).toBeCloseTo(
      now + BASE_MS / 1.35,
      0,
    );
  });

  it("does NOT speed up crimstone with an Ore Hourglass (iron/gold/stone-only)", () => {
    const rock: FiniteResource = {
      stone: { minedAt: now, baseDurationMs: BASE_MS },
      x: 1,
      y: 1,
      minesLeft: 5,
    };
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Ore Hourglass": [
          {
            id: "1",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
      },
    };

    expect(getMineReadyAt(rock, "Crimstone Rock", game)).toEqual(now + BASE_MS);
  });

  it("credits only the overlap for a Mole Shrine placed mid-recovery (retroactive)", () => {
    // Mined 1h ago with no boost: 1h of work already accrued at 1×.
    const rock: FiniteResource = {
      stone: { minedAt: now - ONE_HOUR, baseDurationMs: BASE_MS },
      x: 1,
      y: 1,
      minesLeft: 5,
    };
    const game: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Mole Shrine": [
          {
            id: "1",
            createdAt: now,
            coordinates: { x: 1, y: 1 },
            readyAt: now,
          },
        ],
      },
    };

    // Remaining work (BASE_MS - 1h) now accrues at 1.35× (window covers it fully).
    expect(getMineReadyAt(rock, "Crimstone Rock", game)).toBeCloseTo(
      now + (BASE_MS - ONE_HOUR) / 1.35,
      0,
    );
  });

  it("falls back to base recovery for a legacy rock (no baseDurationMs)", () => {
    const rock: FiniteResource = {
      stone: { minedAt: now },
      x: 1,
      y: 1,
      minesLeft: 5,
    };
    expect(getMineReadyAt(rock, "Crimstone Rock", INITIAL_FARM)).toEqual(
      now + BASE_MS,
    );
  });
});

describe("getMineReadyAt — baseDurationMs is a permanent per-rock marker (crimstone)", () => {
  const now = Date.now();
  const BASE_MS = CRIMSTONE_RECOVERY_TIME * 1000;
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
      minesLeft: 5,
    };

    expect(getMineReadyAt(rock, "Crimstone Rock", INITIAL_FARM)).toEqual(
      now + BASE_MS / 2,
    );
  });
});
