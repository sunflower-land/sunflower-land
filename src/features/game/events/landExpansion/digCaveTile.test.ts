import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type {
  CaveBatch,
  CaveRecipeName,
  GameState,
} from "features/game/types/game";
import { CONFIG } from "lib/config";
import {
  generateCavePatch,
  resolveCaveTile,
} from "features/game/types/cavePatch";
import {
  DIG_CAVE_TILE_ERRORS,
  digCaveTile,
  getCaveMushroomYield,
} from "./digCaveTile";
import type { Bud } from "features/game/types/buds";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";
import { getMushroomYield } from "features/game/lib/mushrooms";

// The Cave building, placed and finished: every cave.* event requires it.
const READY_CAVE = {
  id: "cave",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
};

const NOW = new Date("2026-09-23T00:00:00.000Z").getTime();

// This seed on the Mushroom mix (golden board in cavePatch.test.ts):
//   y0 DMDMD
//   y1 GMMDD   (0,1) Magic Mushroom
//   y2 DDDDD
//   y3 DDMbD   (3,3) Green Beetle
//   y4 DDDpD   (3,4) Pink Beetle
const SEED = "00112233445566778899aabbccddeeff";

const readyState = ({
  batch = {},
  shovels = 10,
}: { batch?: Partial<CaveBatch>; shovels?: number } = {}): GameState => ({
  ...TEST_FARM,
  buildings: { ...TEST_FARM.buildings, Cave: [READY_CAVE] },
  island: { ...TEST_FARM.island, type: "spring" },
  inventory: {
    ...TEST_FARM.inventory,
    "Sand Shovel": new Decimal(shovels),
  },
  cave: {
    builtAt: 1,
    tier: 1,
    machines: {
      "1": {
        batch: {
          recipe: "Mushroom",
          startedAt: 0,
          readyAt: 1,
          seed: SEED,
          ...batch,
        },
      },
    },
  },
});

const dig = (
  state: GameState,
  x: number,
  y: number,
  {
    machineId = "1",
    createdAt = NOW,
    farmId = 1,
  }: { machineId?: string; createdAt?: number; farmId?: number } = {},
) =>
  digCaveTile({
    state,
    action: { type: "cave.dug", machineId, x, y },
    createdAt,
    farmId,
  });

describe("digCaveTile (cave.dug)", () => {
  it("throws while the Cave building is under construction", () => {
    const state = readyState();

    expect(() =>
      dig(
        {
          ...state,
          buildings: {
            ...state.buildings,
            Cave: [{ ...READY_CAVE, readyAt: Number.MAX_SAFE_INTEGER }],
          },
        },
        1,
        0,
      ),
    ).toThrow(DIG_CAVE_TILE_ERRORS.NO_CAVE);
  });

  it("spends one Sand Shovel per dig", () => {
    const next = dig(readyState({ shovels: 3 }), 1, 0);
    expect(next.inventory["Sand Shovel"]?.toNumber()).toBe(2);
  });

  it("still spends a Sand Shovel with the Ancient Shovel equipped", () => {
    const state = readyState({ shovels: 3 });
    const next = dig(
      {
        ...state,
        bumpkin: {
          ...state.bumpkin,
          equipped: { ...state.bumpkin.equipped, tool: "Ancient Shovel" },
        },
      },
      1,
      0,
    );
    expect(next.inventory["Sand Shovel"]?.toNumber()).toBe(2);
  });

  it("records only when the tile was dug", () => {
    const next = dig(readyState(), 1, 0);
    expect(next.cave?.machines["1"].batch?.dug).toEqual({
      "1,0": { dugAt: NOW },
    });
  });

  it.each([
    [1, 0, "Wild Mushroom", 1],
    [0, 1, "Magic Mushroom", 1],
    [3, 3, "Green Beetle", 1],
    [3, 4, "Pink Beetle", 1],
    [0, 0, "Mud", 1],
    [4, 4, "Mud", 1],
  ] as const)("awards tile %s,%s: %s x%s", (x, y, item, amount) => {
    const next = dig(readyState(), x, y);
    expect(next.inventory[item]?.toNumber()).toBe(amount);
  });

  it("awards exactly what the board says for every tile", () => {
    const layout = generateCavePatch({ recipe: "Mushroom", seed: SEED });
    for (let x = 0; x < 5; x += 1) {
      for (let y = 0; y < 5; y += 1) {
        const before = readyState();
        const next = dig(before, x, y);
        const { items } = resolveCaveTile(layout, x, y);
        for (const [name, amount] of Object.entries(items)) {
          const item = name as keyof GameState["inventory"];
          expect(next.inventory[item]?.toNumber()).toBe(
            (before.inventory[item]?.toNumber() ?? 0) + (amount ?? 0),
          );
        }
      }
    }
  });

  it("awards double Mud on a Mud mix patch", () => {
    const recipe: CaveRecipeName = "Mud";
    const layout = generateCavePatch({ recipe, seed: SEED });
    const mudKey = Object.keys(layout).find(
      (key) => layout[key].type === "Mud",
    )!;
    const [x, y] = mudKey.split(",").map(Number);
    const next = dig(readyState({ batch: { recipe } }), x, y);
    expect(next.inventory.Mud?.toNumber()).toBe(2);
  });

  it("keeps a tile's clue after a neighbouring Beetle is dug", () => {
    const layout = generateCavePatch({ recipe: "Mushroom", seed: SEED });
    const clueBefore = resolveCaveTile(layout, 2, 3).clue;
    const afterBeetle = dig(readyState(), 3, 3);
    const next = dig(afterBeetle, 2, 3);
    expect(clueBefore).toBe(1);
    expect(next.cave?.machines["1"].batch?.seed).toBe(SEED);
    expect(resolveCaveTile(layout, 2, 3).clue).toBe(clueBefore);
  });

  it("rejects a tile that was already dug", () => {
    const once = dig(readyState(), 1, 0);
    expect(() => dig(once, 1, 0)).toThrow(DIG_CAVE_TILE_ERRORS.ALREADY_DUG);
  });

  it("rejects without a Sand Shovel", () => {
    expect(() => dig(readyState({ shovels: 0 }), 1, 0)).toThrow(
      DIG_CAVE_TILE_ERRORS.NO_SHOVEL,
    );
  });

  it("rejects before the batch is ready", () => {
    const state = readyState({ batch: { readyAt: NOW + 1 } });
    expect(() => dig(state, 1, 0)).toThrow(DIG_CAVE_TILE_ERRORS.NOT_READY);
  });

  it("rejects a batch without its seed", () => {
    const state = readyState({ batch: { seed: undefined } });
    expect(() => dig(state, 1, 0)).toThrow(DIG_CAVE_TILE_ERRORS.NO_SEED);
  });

  it("rejects a batch whose seed is not a 128-bit hex seed", () => {
    const state = readyState({
      batch: { seed: 12345 as unknown as string },
    });
    expect(() => dig(state, 1, 0)).toThrow(DIG_CAVE_TILE_ERRORS.NO_SEED);
  });

  it.each([
    [5, 0],
    [0, 5],
    [-1, 0],
    [1.5, 0],
  ])("rejects the out-of-patch tile %s,%s", (x, y) => {
    expect(() => dig(readyState(), x, y)).toThrow(
      DIG_CAVE_TILE_ERRORS.INVALID_TILE,
    );
  });

  it("rejects a machine without a batch", () => {
    const state = readyState();
    expect(() =>
      dig({ ...state, cave: { ...state.cave!, machines: { "1": {} } } }, 1, 0),
    ).toThrow(DIG_CAVE_TILE_ERRORS.NO_BATCH);
  });

  it("rejects an unknown machine", () => {
    expect(() => dig(readyState(), 1, 0, { machineId: "9" })).toThrow(
      DIG_CAVE_TILE_ERRORS.NO_MACHINE,
    );
  });

  it("rejects when the Cave has not been built", () => {
    expect(() => dig({ ...readyState(), cave: undefined }, 1, 0)).toThrow(
      DIG_CAVE_TILE_ERRORS.NO_CAVE,
    );
  });

  it("does not spend a shovel when rejected", () => {
    const once = dig(readyState({ shovels: 3 }), 1, 0);
    expect(() => dig(once, 1, 0)).toThrow();
    expect(once.inventory["Sand Shovel"]?.toNumber()).toBe(2);
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
      expect(() => dig(readyState(), 1, 0)).toThrow(
        DIG_CAVE_TILE_ERRORS.NO_FEATURE_ACCESS,
      );
    });

    it("is unlocked by holding a Beta Pass", () => {
      const state = readyState();
      expect(() =>
        dig(
          {
            ...state,
            inventory: { ...state.inventory, "Beta Pass": new Decimal(1) },
          },
          1,
          0,
        ),
      ).not.toThrow();
    });
  });
});

// A placed Bud with the Mushroom stem, whose only boost is +0.3 Wild Mushroom.
const mushroomBud = (overrides: Partial<Bud> = {}): Bud => ({
  type: "Plaza",
  colour: "Blue",
  ears: "No Ears",
  aura: "No Aura",
  stem: "Mushroom",
  coordinates: { x: 0, y: 0 },
  ...overrides,
});

describe("getCaveMushroomYield", () => {
  it("is 1 Wild Mushroom without a Bud", () => {
    expect(
      getCaveMushroomYield({
        name: "Wild Mushroom",
        game: { ...readyState(), buds: {} },
      }).amount,
    ).toBe(1);
  });

  it("adds a placed Mushroom-stem Bud's bonus", () => {
    expect(
      getCaveMushroomYield({
        name: "Wild Mushroom",
        game: { ...readyState(), buds: { 1: mushroomBud() } },
      }).amount,
    ).toBe(1.3);
  });

  it("multiplies the Bud's bonus by its aura", () => {
    expect(
      getCaveMushroomYield({
        name: "Wild Mushroom",
        game: { ...readyState(), buds: { 1: mushroomBud({ aura: "Rare" }) } },
      }).amount,
    ).toBe(1.6);
  });

  it("ignores a Bud that is not placed", () => {
    expect(
      getCaveMushroomYield({
        name: "Wild Mushroom",
        game: {
          ...readyState(),
          buds: { 1: mushroomBud({ coordinates: undefined }) },
        },
      }).amount,
    ).toBe(1);
  });
});

describe("digCaveTile: Mushroom Bud", () => {
  it("awards a Mushroom tile's Wild Mushrooms with the Bud bonus", () => {
    const next = dig({ ...readyState(), buds: { 1: mushroomBud() } }, 1, 0);

    expect(next.inventory["Wild Mushroom"]?.toNumber()).toBe(1.3);
    expect(next.boostsUsedAt?.["Bud #1"]).toBe(NOW);
  });

  it("does not add the Bud bonus to other tiles", () => {
    const next = dig({ ...readyState(), buds: { 1: mushroomBud() } }, 0, 0);

    expect(next.inventory.Mud?.toNumber()).toBe(1);
    expect(next.boostsUsedAt?.["Bud #1"]).toBeUndefined();
  });
});

describe("getCaveMushroomYield: Wild Mushroom boosts", () => {
  const PLACED = [
    { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
  ];

  const withHat = (game: GameState): GameState => ({
    ...game,
    bumpkin: {
      ...game.bumpkin,
      equipped: { ...game.bumpkin.equipped, hat: "Mushroom Hat" },
    },
  });

  const allBoosts = (): GameState =>
    withHat({
      ...readyState(),
      buds: { 1: mushroomBud() },
      collectibles: { "Mushroom House": PLACED, "Fairy Circle": PLACED },
    });

  it.each([
    ["Mushroom House", 1.2],
    ["Fairy Circle", 1.2],
  ] as const)("adds a placed %s's bonus", (name, amount) => {
    expect(
      getCaveMushroomYield({
        name: "Wild Mushroom",
        game: { ...readyState(), buds: {}, collectibles: { [name]: PLACED } },
      }).amount,
    ).toBe(amount);
  });

  it("adds the Mushroom Hat's bonus", () => {
    expect(
      getCaveMushroomYield({
        name: "Wild Mushroom",
        game: withHat({ ...readyState(), buds: {} }),
      }).amount,
    ).toBe(1.1);
  });

  it("stacks every Wild Mushroom boost exactly", () => {
    // 1 + 0.2 + 0.2 + 0.1 + 0.3
    expect(
      getCaveMushroomYield({ name: "Wild Mushroom", game: allBoosts() }).amount,
    ).toBe(1.8);
  });

  it("records every boost used when digging a Mushroom tile", () => {
    const next = dig(allBoosts(), 1, 0);

    expect(next.inventory["Wild Mushroom"]?.toNumber()).toBe(1.8);
    expect(next.boostsUsedAt).toMatchObject({
      "Mushroom House": NOW,
      "Fairy Circle": NOW,
      "Mushroom Hat": NOW,
      "Bud #1": NOW,
    });
  });

  it("gives a Magic Mushroom tile none of the Wild Mushroom boosts", () => {
    // allBoosts' Bud has the Mushroom stem, which boosts Wild Mushrooms only.
    const next = dig(allBoosts(), 0, 1);

    expect(next.inventory["Magic Mushroom"]?.toNumber()).toBe(1);
    expect(next.inventory["Wild Mushroom"]).toBeUndefined();
    expect(next.boostsUsedAt?.["Bud #1"]).toBeUndefined();
    expect(next.boostsUsedAt?.["Mushroom House"]).toBeUndefined();
    expect(next.boostsUsedAt?.["Fairy Circle"]).toBeUndefined();
    expect(next.boostsUsedAt?.["Mushroom Hat"]).toBeUndefined();
  });

  it("gives a Magic Mushroom tile the Magic Mushroom-stem Bud bonus, like the island", () => {
    const next = dig(
      { ...allBoosts(), buds: { 1: mushroomBud({ stem: "Magic Mushroom" }) } },
      0,
      1,
    );

    expect(next.inventory["Magic Mushroom"]?.toNumber()).toBe(1.2);
    expect(next.boostsUsedAt?.["Bud #1"]).toBe(NOW);
  });
});

describe("digCaveTile: Cave skills", () => {
  const FARM_ID = 7;

  const withSkills = (
    skills: GameState["bumpkin"]["skills"],
    state = readyState(),
  ): GameState => ({ ...state, bumpkin: { ...state.bumpkin, skills } });

  const withTilesDug = (state: GameState, count: number): GameState => ({
    ...state,
    farmActivity: { ...state.farmActivity, "Cave Tile Dug": count },
  });

  it("counts every tile dug in the farm activity", () => {
    const once = dig(readyState(), 1, 0);
    const twice = dig(once, 0, 0);
    expect(once.farmActivity["Cave Tile Dug"]).toBe(1);
    expect(twice.farmActivity["Cave Tile Dug"]).toBe(2);
  });

  it.each([
    [1, 1.1],
    [2, 1.2],
    [3, 1.3],
  ])("Muddy Bounty rank %s awards %s Mud from a Mud tile", (rank, mud) => {
    const next = dig(withSkills({ "Muddy Bounty": rank }), 0, 0);
    expect(next.inventory.Mud?.toNumber()).toBe(mud);
    expect(next.boostsUsedAt?.["Muddy Bounty"]).toBe(NOW);
  });

  it("Muddy Bounty multiplies a Mud mix tile's double Mud", () => {
    const layout = generateCavePatch({ recipe: "Mud", seed: SEED });
    const mudKey = Object.keys(layout).find(
      (key) => layout[key].type === "Mud",
    )!;
    const [x, y] = mudKey.split(",").map(Number);
    const next = dig(
      withSkills(
        { "Muddy Bounty": 3 },
        readyState({ batch: { recipe: "Mud" } }),
      ),
      x,
      y,
    );
    expect(next.inventory.Mud?.toNumber()).toBe(2.6);
  });

  it("Muddy Bounty leaves Mushroom tiles alone", () => {
    const next = dig(withSkills({ "Muddy Bounty": 3 }), 1, 0);
    expect(next.inventory["Wild Mushroom"]?.toNumber()).toBe(1);
    expect(next.boostsUsedAt?.["Muddy Bounty"]).toBeUndefined();
  });

  it.each([
    [1, 1.2],
    [2, 1.3],
    [3, 1.4],
  ])("Fungal Harvest rank %s yields %s Wild Mushrooms", (rank, amount) => {
    expect(
      getCaveMushroomYield({
        name: "Wild Mushroom",
        game: withSkills({ "Fungal Harvest": rank }),
      }).amount,
    ).toBe(amount);
  });

  it("Fungal Harvest boosts Magic Mushroom tiles too", () => {
    const next = dig(withSkills({ "Fungal Harvest": 3 }), 0, 1);
    expect(next.inventory["Magic Mushroom"]?.toNumber()).toBe(1.4);
    expect(next.boostsUsedAt?.["Fungal Harvest"]).toBe(NOW);
  });

  it("Fungal Harvest adds to the Wild Mushroom boosts", () => {
    const state = withSkills({ "Fungal Harvest": 3 });
    expect(
      getCaveMushroomYield({
        name: "Wild Mushroom",
        game: {
          ...state,
          collectibles: {
            "Mushroom House": [
              {
                id: "1",
                createdAt: 0,
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
              },
            ],
          },
        },
      }).amount,
    ).toBe(1.6);
  });

  it("Fungal Harvest does not boost island Mushrooms", () => {
    expect(
      getMushroomYield({
        name: "Wild Mushroom",
        game: withSkills({ "Fungal Harvest": 3 }),
      }).amount,
    ).toBe(1);
  });

  it("Sturdy Shovel keeps the Sand Shovel exactly when its roll hits", () => {
    let hits = 0;
    for (let counter = 0; counter < 40; counter += 1) {
      const hit = prngChance({
        farmId: FARM_ID,
        itemId: KNOWN_IDS["Sand Shovel"],
        counter,
        chance: 30,
        criticalHitName: "Sturdy Shovel",
      });
      if (hit) hits += 1;

      const next = dig(
        withTilesDug(withSkills({ "Sturdy Shovel": 3 }), counter),
        1,
        0,
        { farmId: FARM_ID },
      );
      expect(next.inventory["Sand Shovel"]?.toNumber()).toBe(hit ? 10 : 9);
      expect(next.boostsUsedAt?.["Sturdy Shovel"]).toBe(hit ? NOW : undefined);
    }
    expect(hits).toBeGreaterThan(0);
    expect(hits).toBeLessThan(40);
  });

  it("Sturdy Shovel still needs a Sand Shovel to dig", () => {
    expect(() =>
      dig(withSkills({ "Sturdy Shovel": 3 }, readyState({ shovels: 0 })), 1, 0),
    ).toThrow(DIG_CAVE_TILE_ERRORS.NO_SHOVEL);
  });

  it("Twin Beetles adds one more of the Beetle exactly when its roll hits", () => {
    let hits = 0;
    for (let counter = 0; counter < 60; counter += 1) {
      const hit = prngChance({
        farmId: FARM_ID,
        itemId: KNOWN_IDS["Green Beetle"],
        counter,
        chance: 15,
        criticalHitName: "Twin Beetles",
      });
      if (hit) hits += 1;

      // (3,3) is a Green Beetle on this board.
      const next = dig(
        withTilesDug(withSkills({ "Twin Beetles": 3 }), counter),
        3,
        3,
        { farmId: FARM_ID },
      );
      expect(next.inventory["Green Beetle"]?.toNumber()).toBe(hit ? 2 : 1);
      expect(next.boostsUsedAt?.["Twin Beetles"]).toBe(hit ? NOW : undefined);
    }
    expect(hits).toBeGreaterThan(0);
    expect(hits).toBeLessThan(60);
  });

  it("Twin Beetles never doubles a Mushroom or Mud tile", () => {
    // Twin Beetles at 100% would still only touch Beetle tiles; at rank 3 any
    // extra item on these tiles would come from it.
    for (let counter = 0; counter < 20; counter += 1) {
      const state = withTilesDug(withSkills({ "Twin Beetles": 3 }), counter);
      expect(
        dig(state, 1, 0, { farmId: FARM_ID }).inventory[
          "Wild Mushroom"
        ]?.toNumber(),
      ).toBe(1);
      expect(
        dig(state, 0, 0, { farmId: FARM_ID }).inventory.Mud?.toNumber(),
      ).toBe(1);
    }
  });
});
