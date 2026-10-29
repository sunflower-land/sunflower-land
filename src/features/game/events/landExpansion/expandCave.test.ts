import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState, IslandType } from "features/game/types/game";
import {
  CAVE_MAX_TIER,
  CAVE_TIERS,
  type CaveExpansionTier,
} from "features/game/types/caveTiers";
import { getKeys } from "lib/object";
import { CONFIG } from "lib/config";
import { EXPAND_CAVE_ERRORS, expandCave } from "./expandCave";

// The Cave building, placed and finished: every cave.* event requires it.
const READY_CAVE = {
  id: "cave",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
};

const NOW = 1_700_000_000_000;

// Islands in unlock order; a tier's gate island and the one just below it.
const ISLANDS: IslandType[] = [
  "basic",
  "spring",
  "desert",
  "volcano",
  "swamp",
  "spooky",
  "crystal",
  "galaxy",
  "marble",
];

const richState = ({
  tier = 1,
  island = "marble",
}: { tier?: number; island?: IslandType } = {}): GameState => ({
  ...TEST_FARM,
  buildings: { ...TEST_FARM.buildings, Cave: [READY_CAVE] },
  island: { ...TEST_FARM.island, type: island },
  coins: 10_000_000,
  inventory: {
    ...TEST_FARM.inventory,
    Mud: new Decimal(100_000),
    Wood: new Decimal(100_000),
    Stone: new Decimal(100_000),
    Leather: new Decimal(100_000),
    "Pig Bristles": new Decimal(100_000),
  },
  cave: {
    builtAt: 1,
    tier,
    machines: Object.fromEntries(
      Array.from({ length: tier }, (_, i) => [String(i + 1), {}]),
    ),
  },
});

const expand = (state: GameState, createdAt = NOW) =>
  expandCave({ state, action: { type: "cave.expanded" }, createdAt });

const TIERS = getKeys(CAVE_TIERS).map(Number) as CaveExpansionTier[];

describe("CAVE_TIERS", () => {
  it("covers tiers II to VIII", () => {
    expect(TIERS).toEqual([2, 3, 4, 5, 6, 7, 8]);
    expect(CAVE_MAX_TIER).toBe(8);
  });

  it("builds each tier in 2h to 48h", () => {
    const hours = Object.fromEntries(
      TIERS.map((tier) => [tier, CAVE_TIERS[tier].buildMs / (60 * 60 * 1000)]),
    );

    expect(hours).toEqual({ 2: 2, 3: 4, 4: 8, 5: 12, 6: 24, 7: 36, 8: 48 });
  });

  it("charges the #7721 costs with the 2026-10-21 Mud rescale at every tier", () => {
    const costs = Object.fromEntries(
      TIERS.map((tier) => [
        tier,
        {
          coins: CAVE_TIERS[tier].coins,
          ...Object.fromEntries(
            getKeys(CAVE_TIERS[tier].ingredients).map((item) => [
              item,
              CAVE_TIERS[tier].ingredients[item]!.toNumber(),
            ]),
          ),
        },
      ]),
    );

    expect(costs).toEqual({
      2: { coins: 500, Mud: 80, Wood: 25, Stone: 10 },
      3: { coins: 1_000, Mud: 160, Wood: 50, Stone: 25, Leather: 10 },
      4: { coins: 2_500, Mud: 320, Wood: 75, Stone: 50, Leather: 15 },
      5: { coins: 5_000, Mud: 640, Wood: 100, Stone: 75, "Pig Bristles": 20 },
      6: {
        coins: 10_000,
        Mud: 960,
        Wood: 150,
        Stone: 100,
        "Pig Bristles": 30,
      },
      7: {
        coins: 20_000,
        Mud: 1_440,
        Wood: 200,
        Stone: 150,
        "Pig Bristles": 40,
      },
      8: {
        coins: 40_000,
        Mud: 2_200,
        Wood: 250,
        Stone: 200,
        "Pig Bristles": 50,
      },
    });
  });

  it("unlocks each tier on the next island in order", () => {
    expect(TIERS.map((tier) => CAVE_TIERS[tier].island)).toEqual([
      "desert",
      "volcano",
      "swamp",
      "spooky",
      "crystal",
      "galaxy",
      "marble",
    ]);
  });
});

describe("expandCave (cave.expanded)", () => {
  it("throws while the Cave building is under construction", () => {
    const state = richState();

    expect(() =>
      expand({
        ...state,
        buildings: {
          ...state.buildings,
          Cave: [{ ...READY_CAVE, readyAt: Number.MAX_SAFE_INTEGER }],
        },
      }),
    ).toThrow(EXPAND_CAVE_ERRORS.NO_CAVE);
  });

  it.each(TIERS)("starts building tier %s", (tier) => {
    const next = expand(richState({ tier: tier - 1 }));
    expect(next.cave?.construction).toEqual({
      tier,
      startedAt: NOW,
      readyAt: NOW + CAVE_TIERS[tier].buildMs,
    });
  });

  it.each(TIERS)("gates tier %s on its island", (tier) => {
    const gate = CAVE_TIERS[tier].island;
    const below = ISLANDS[ISLANDS.indexOf(gate) - 1];

    expect(() => expand(richState({ tier: tier - 1, island: below }))).toThrow(
      EXPAND_CAVE_ERRORS.ISLAND_TOO_LOW,
    );
    expect(
      expand(richState({ tier: tier - 1, island: gate })).cave?.construction
        ?.tier,
    ).toBe(tier);
  });

  it("keeps the island gate passing past marble's first ascension", () => {
    const state = richState({ tier: 7, island: "marble" });
    const next = expand({
      ...state,
      island: { ...state.island, ascensionLevel: 9 },
    });
    expect(next.cave?.construction?.tier).toBe(8);
  });

  it.each(TIERS)("charges the coins and resources for tier %s", (tier) => {
    const before = richState({ tier: tier - 1 });
    const next = expand(before);
    const { coins, ingredients } = CAVE_TIERS[tier];

    expect(next.coins).toBe(before.coins - coins);
    for (const item of getKeys(ingredients)) {
      expect(next.inventory[item]?.toNumber()).toBe(
        before.inventory[item]!.minus(ingredients[item]!).toNumber(),
      );
    }
  });

  it("does not change the tier or machines until the expansion completes", () => {
    const before = richState({ tier: 2 });
    const next = expand(before);
    expect(next.cave?.tier).toBe(2);
    expect(next.cave?.machines).toEqual(before.cave?.machines);
  });

  it("rejects without enough coins", () => {
    const state = { ...richState(), coins: CAVE_TIERS[2].coins - 1 };
    expect(() => expand(state)).toThrow(EXPAND_CAVE_ERRORS.INSUFFICIENT_COINS);
  });

  it("rejects without enough resources", () => {
    const state = richState();
    const item = getKeys(CAVE_TIERS[2].ingredients)[0];
    const short = {
      ...state,
      inventory: {
        ...state.inventory,
        [item]: CAVE_TIERS[2].ingredients[item]!.minus(1),
      },
    };
    expect(() => expand(short)).toThrow(
      EXPAND_CAVE_ERRORS.INSUFFICIENT_INVENTORY,
    );
  });

  it("rejects a second expansion while one is being built", () => {
    const building = expand(richState());
    expect(() => expand(building, NOW + 1)).toThrow(
      EXPAND_CAVE_ERRORS.ALREADY_EXPANDING,
    );
  });

  it("rejects a second expansion once the first is ready but not completed", () => {
    const building = expand(richState());
    const readyAt = building.cave!.construction!.readyAt;
    expect(() => expand(building, readyAt + 1)).toThrow(
      EXPAND_CAVE_ERRORS.ALREADY_EXPANDING,
    );
  });

  it("rejects past the last tier", () => {
    expect(() => expand(richState({ tier: CAVE_MAX_TIER }))).toThrow(
      EXPAND_CAVE_ERRORS.MAX_TIER,
    );
  });

  it("rejects when the Cave has not been built", () => {
    expect(() => expand({ ...richState(), cave: undefined })).toThrow(
      EXPAND_CAVE_ERRORS.NO_CAVE,
    );
  });

  describe("off testnet", () => {
    // jest runs on amoy, so the flag-off path is only reachable by pretending
    // to be mainnet.
    let previousNetwork: (typeof CONFIG)["NETWORK"];

    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });

    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
    });

    it("throws without the CAVE feature flag", () => {
      expect(() => expand(richState())).toThrow(
        EXPAND_CAVE_ERRORS.NO_FEATURE_ACCESS,
      );
    });

    it("is unlocked by holding a Beta Pass", () => {
      const state = richState();
      expect(() =>
        expand({
          ...state,
          inventory: { ...state.inventory, "Beta Pass": new Decimal(1) },
        }),
      ).not.toThrow();
    });
  });
});
