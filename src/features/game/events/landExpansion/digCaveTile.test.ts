import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type {
  CaveBatch,
  CaveRecipeName,
  GameState,
} from "features/game/types/game";
import { CONFIG } from "lib/config";
import {
  resolveCaveTile,
  revealCavePatch,
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

// Each dig draws its own board from the seed and its `createdAt`
// (revealCavePatch). What the FIRST dig of each tile finds at NOW on this seed
// and the Mushroom mix:
//   y0 DDMDM   (2,0) Wild Mushroom
//   y1 MMDDD
//   y2 DDMDD
//   y3 GGDDD   (0,3) Magic Mushroom
//   y4 MDDDD   (0,0) and (4,4) Mud
// No first dig at NOW finds a Beetle: (4,1) is a Green Beetle at NOW + 1.
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

/** The board a dig of (x, y) at `createdAt` draws for the state's batch. */
const boardFor = (state: GameState, x: number, y: number, createdAt = NOW) =>
  revealCavePatch({
    batch: state.cave!.machines["1"].batch!,
    createdAt,
    x,
    y,
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
        2,
        0,
      ),
    ).toThrow(DIG_CAVE_TILE_ERRORS.NO_CAVE);
  });

  it("spends one Sand Shovel per dig", () => {
    const next = dig(readyState({ shovels: 3 }), 2, 0);
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
      2,
      0,
    );
    expect(next.inventory["Sand Shovel"]?.toNumber()).toBe(2);
  });

  it("records what the tile held and the clue it showed", () => {
    const board = boardFor(readyState(), 2, 0);
    const next = dig(readyState(), 2, 0);
    expect(next.cave?.machines["1"].batch?.dug).toEqual({
      "2,0": {
        dugAt: NOW,
        tile: { type: "Mushroom", mushroom: "Wild Mushroom" },
        clue: resolveCaveTile(board, 2, 0).clue,
      },
    });
  });

  it.each([
    [2, 0, NOW, "Wild Mushroom", 1],
    [0, 3, NOW, "Magic Mushroom", 1],
    [4, 1, NOW + 1, "Green Beetle", 1],
    [2, 0, NOW + 2, "Pink Beetle", 1],
    [0, 0, NOW, "Mud", 1],
    [4, 4, NOW, "Mud", 1],
  ] as const)(
    "awards tile %s,%s dug at %s: %s x%s",
    (x, y, createdAt, item, amount) => {
      const next = dig(readyState(), x, y, { createdAt });
      expect(next.inventory[item]?.toNumber()).toBe(amount);
    },
  );

  it("awards exactly what the dig's board says for every tile", () => {
    for (let x = 0; x < 5; x += 1) {
      for (let y = 0; y < 5; y += 1) {
        const before = readyState();
        const next = dig(before, x, y);
        const { items } = resolveCaveTile(boardFor(before, x, y), x, y);
        for (const [name, amount] of Object.entries(items)) {
          const item = name as keyof GameState["inventory"];
          expect(next.inventory[item]?.toNumber()).toBe(
            (before.inventory[item]?.toNumber() ?? 0) + (amount ?? 0),
          );
        }
      }
    }
  });

  it("finds something else when the same dig is replayed a moment later", () => {
    // The rollback exploit: dig, lose the save, dig the same tile again.
    const found = new Set(
      Array.from({ length: 30 }, (_, i) =>
        JSON.stringify(
          dig(readyState(), 2, 2, { createdAt: NOW + i }).cave?.machines["1"]
            .batch?.dug?.["2,2"].tile,
        ),
      ),
    );
    expect(found.size).toBeGreaterThan(1);
  });

  it("awards double Mud on a Mud mix patch", () => {
    const recipe: CaveRecipeName = "Mud";
    // (0,0) is Mud on the first dig at NOW of the Mud mix too.
    const next = dig(readyState({ batch: { recipe } }), 0, 0);
    expect(next.inventory.Mud?.toNumber()).toBe(2);
  });

  it("digs a tile's neighbours to exactly the clue it showed", () => {
    let state = dig(readyState(), 2, 0);
    const clue = state.cave?.machines["1"].batch?.dug?.["2,0"].clue;
    expect(typeof clue).toBe("number");

    const neighbours = [
      { x: 1, y: 0 },
      { x: 3, y: 0 },
      { x: 2, y: 1 },
    ];
    neighbours.forEach(({ x, y }, i) => {
      state = dig(state, x, y, { createdAt: NOW + 1000 * (i + 1) });
    });

    const dug = state.cave?.machines["1"].batch?.dug ?? {};
    const found = neighbours.filter(
      ({ x, y }) => dug[`${x},${y}`].tile?.type !== "Mud",
    ).length;
    expect(found).toBe(clue);
    // The tile's own record never changes.
    expect(dug["2,0"].clue).toBe(clue);
    expect(state.cave?.machines["1"].batch?.seed).toBe(SEED);
  });

  it("rejects a tile that was already dug", () => {
    const once = dig(readyState(), 2, 0);
    expect(() => dig(once, 2, 0)).toThrow(DIG_CAVE_TILE_ERRORS.ALREADY_DUG);
  });

  it("rejects without a Sand Shovel", () => {
    expect(() => dig(readyState({ shovels: 0 }), 2, 0)).toThrow(
      DIG_CAVE_TILE_ERRORS.NO_SHOVEL,
    );
  });

  it("rejects before the batch is ready", () => {
    const state = readyState({ batch: { readyAt: NOW + 1 } });
    expect(() => dig(state, 2, 0)).toThrow(DIG_CAVE_TILE_ERRORS.NOT_READY);
  });

  it("rejects a batch without its seed", () => {
    const state = readyState({ batch: { seed: undefined } });
    expect(() => dig(state, 2, 0)).toThrow(DIG_CAVE_TILE_ERRORS.NO_SEED);
  });

  it("rejects a batch whose seed is not a 128-bit hex seed", () => {
    const state = readyState({
      batch: { seed: 12345 as unknown as string },
    });
    expect(() => dig(state, 2, 0)).toThrow(DIG_CAVE_TILE_ERRORS.NO_SEED);
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
      dig({ ...state, cave: { ...state.cave!, machines: { "1": {} } } }, 2, 0),
    ).toThrow(DIG_CAVE_TILE_ERRORS.NO_BATCH);
  });

  it("rejects an unknown machine", () => {
    expect(() => dig(readyState(), 2, 0, { machineId: "9" })).toThrow(
      DIG_CAVE_TILE_ERRORS.NO_MACHINE,
    );
  });

  it("rejects when the Cave has not been built", () => {
    expect(() => dig({ ...readyState(), cave: undefined }, 2, 0)).toThrow(
      DIG_CAVE_TILE_ERRORS.NO_CAVE,
    );
  });

  it("does not spend a shovel when rejected", () => {
    const once = dig(readyState({ shovels: 3 }), 2, 0);
    expect(() => dig(once, 2, 0)).toThrow();
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
      expect(() => dig(readyState(), 2, 0)).toThrow(
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
          2,
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
    const next = dig({ ...readyState(), buds: { 1: mushroomBud() } }, 2, 0);

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
    const next = dig(allBoosts(), 2, 0);

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
    const next = dig(allBoosts(), 0, 3);

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
      3,
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
    const once = dig(readyState(), 2, 0);
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
    const next = dig(
      withSkills(
        { "Muddy Bounty": 3 },
        readyState({ batch: { recipe: "Mud" } }),
      ),
      0,
      0,
    );
    expect(next.inventory.Mud?.toNumber()).toBe(2.6);
  });

  it("Muddy Bounty leaves Mushroom tiles alone", () => {
    const next = dig(withSkills({ "Muddy Bounty": 3 }), 2, 0);
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
    const next = dig(withSkills({ "Fungal Harvest": 3 }), 0, 3);
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
      dig(withSkills({ "Sturdy Shovel": 3 }, readyState({ shovels: 0 })), 2, 0),
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

      // (4,1) is a Green Beetle when first dug at NOW + 1.
      const next = dig(
        withTilesDug(withSkills({ "Twin Beetles": 3 }), counter),
        4,
        1,
        { farmId: FARM_ID, createdAt: NOW + 1 },
      );
      expect(next.inventory["Green Beetle"]?.toNumber()).toBe(hit ? 2 : 1);
      expect(next.boostsUsedAt?.["Twin Beetles"]).toBe(
        hit ? NOW + 1 : undefined,
      );
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
        dig(state, 2, 0, { farmId: FARM_ID }).inventory[
          "Wild Mushroom"
        ]?.toNumber(),
      ).toBe(1);
      expect(
        dig(state, 0, 0, { farmId: FARM_ID }).inventory.Mud?.toNumber(),
      ).toBe(1);
    }
  });
});
