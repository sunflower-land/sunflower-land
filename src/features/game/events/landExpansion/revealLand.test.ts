import Decimal from "decimal.js-light";
import { getRewards, revealLand } from "./revealLand";
import {
  CRIMSTONE_RECOVERY_TIME,
  GOLD_RECOVERY_TIME,
  INITIAL_FARM,
  IRON_RECOVERY_TIME,
  STONE_RECOVERY_TIME,
  TEST_FARM,
  TREE_RECOVERY_TIME,
} from "features/game/lib/constants";
import {
  EXPANSION_REQUIREMENTS,
  SPRING_LAYOUTS,
  TOTAL_EXPANSION_NODES,
  getBasicLand,
} from "features/game/types/expansions";
import type { Nodes } from "features/game/expansion/lib/expansionNodes";
import { BB_TO_GEM_RATIO, type FiniteResource } from "features/game/types/game";
import { OIL_RESERVE_RECOVERY_TIME } from "./drillOilReserve";

describe("getRewards", () => {
  it("returns rewards for previously built expansions", () => {
    const rewards = getRewards({
      game: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(5),
        },
        island: {
          type: "spring",
          previousExpansions: 16,
        },
      },
      createdAt: Date.now(),
    });

    expect(rewards[0].items).toEqual(
      EXPANSION_REQUIREMENTS.basic[10].resources,
    );
  });
  it("returns correct maximum refund rewards", () => {
    const rewards = getRewards({
      game: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(18),
        },
        island: {
          type: "spring",
          previousExpansions: 23,
        },
      },
      createdAt: Date.now(),
    });

    expect(rewards[0].items).toEqual(
      EXPANSION_REQUIREMENTS.basic[23].resources,
    );
  });

  it("does not return anymore rewards if player has no more expansion refunds", () => {
    const rewards = getRewards({
      game: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(5),
          // Hold the full expected nodes so nothing is reported as missing
          "Crop Plot": new Decimal(33),
          "Fruit Patch": new Decimal(3),
          "Gold Rock": new Decimal(3),
          "Iron Rock": new Decimal(5),
          "Stone Rock": new Decimal(9),
          Tree: new Decimal(11),
        },
        island: {
          type: "spring",
          previousExpansions: 9,
        },
      },
      createdAt: Date.now(),
    });

    expect(rewards).toEqual([]);
  });

  it("refunds the 17th spring expansion on desert island", () => {
    const rewards = getRewards({
      game: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(5),
        },
        island: {
          type: "desert",
          previousExpansions: 23,
        },
      },
      createdAt: Date.now(),
    });

    expect(rewards[0].items).toEqual(
      EXPANSION_REQUIREMENTS.spring[17].resources,
    );
  });
});

describe("totalExpansions", () => {
  it("should have the correct amount of nodes for each basic expansion", () => {
    // Starting nodes
    const nodes: Nodes = {
      "Crimstone Rock": 0,
      "Crop Plot": 0,
      "Flower Bed": 0,
      "Fruit Patch": 0,
      "Gold Rock": 0,
      "Iron Rock": 0,
      "Stone Rock": 2,
      "Sunstone Rock": 0,
      Beehive: 0,
      Tree: 3,
      "Oil Reserve": 0,
      "Lava Pit": 0,
      "Ascension Crystal": 0,
    };

    let expansion = 4;
    while (expansion <= 9 && getBasicLand({ expansion })) {
      const layout = getBasicLand({ expansion });

      if (layout) {
        nodes.Beehive += layout.beehives?.length ?? 0;
        nodes["Crop Plot"] += layout.plots?.length ?? 0;
        nodes["Flower Bed"] += layout.flowerBeds?.length ?? 0;
        nodes["Fruit Patch"] += layout.fruitPatches?.length ?? 0;
        nodes["Gold Rock"] += layout.gold?.length ?? 0;
        nodes["Iron Rock"] += layout.iron?.length ?? 0;
        nodes["Stone Rock"] += layout.stones?.length ?? 0;
        nodes["Sunstone Rock"] += layout.sunstones?.length ?? 0;
        nodes.Tree += layout.trees?.length ?? 0;
        nodes["Crimstone Rock"] += layout.crimstones?.length ?? 0;

        // console.log({ expansion, nodes });
        expect(nodes).toEqual(TOTAL_EXPANSION_NODES.basic[expansion]);
      }

      expansion += 1;
    }
  });

  it("should have the correct amount of nodes for each spring expansion", () => {
    // Starting nodes
    const nodes = TOTAL_EXPANSION_NODES.spring[4];

    let expansion = 5;
    while (SPRING_LAYOUTS()[expansion]) {
      const layout = SPRING_LAYOUTS()[expansion];

      nodes.Beehive += layout.beehives?.length ?? 0;
      nodes["Crop Plot"] += layout.plots?.length ?? 0;
      nodes["Flower Bed"] += layout.flowerBeds?.length ?? 0;
      nodes["Fruit Patch"] += layout.fruitPatches?.length ?? 0;
      nodes["Gold Rock"] += layout.gold?.length ?? 0;
      nodes["Iron Rock"] += layout.iron?.length ?? 0;
      nodes["Stone Rock"] += layout.stones?.length ?? 0;
      nodes["Sunstone Rock"] += layout.sunstones?.length ?? 0;
      nodes.Tree += layout.trees?.length ?? 0;
      nodes["Crimstone Rock"] += layout.crimstones?.length ?? 0;

      expect(nodes).toEqual(TOTAL_EXPANSION_NODES.spring[expansion]);

      expansion += 1;
    }
  });
});

describe("revealLand", () => {
  it("requires land exists", () => {
    expect(() =>
      revealLand({
        action: {
          type: "land.revealed",
        },

        state: {
          ...TEST_FARM,
          expansionConstruction: { createdAt: 0, readyAt: 0 },
          inventory: { "Basic Land": new Decimal(1000) },
        },
      }),
    ).toThrow("Land Does Not Exists");
  });

  it("requires land is under construction", () => {
    expect(() =>
      revealLand({
        action: {
          type: "land.revealed",
        },

        state: {
          ...TEST_FARM,
          inventory: { "Basic Land": new Decimal(1000) },
        },
      }),
    ).toThrow("Land is not in construction");
  });

  it("removes land in construction", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(3),
          Stone: new Decimal(5),
          Gem: new Decimal(3 * BB_TO_GEM_RATIO),
          Wood: new Decimal(1),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
    });

    expect(state.expansionConstruction).toBeUndefined();
  });

  it("adds basic land", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      createdAt: now,
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(3),
          Stone: new Decimal(5),
          Gem: new Decimal(3 * BB_TO_GEM_RATIO),
          Wood: new Decimal(1),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
    });

    expect(state?.inventory["Basic Land"]).toEqual(new Decimal(4));
  });

  it("adds trees", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(3),
          Tree: new Decimal(3),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
    });

    expect(state.inventory.Tree).toEqual(new Decimal(5));
    expect(Object.keys(state.trees ?? {})).toHaveLength(5);
  });

  it("adds stones", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(3),
          "Stone Rock": new Decimal(2),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
    });

    expect(state.inventory["Stone Rock"]).toEqual(new Decimal(3));
    expect(Object.values(state.stones ?? {})).toHaveLength(3);
  });

  it("adds iron", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(3),
          "Iron Rock": new Decimal(0),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
    });

    expect(state.inventory["Iron Rock"]).toEqual(new Decimal(1));
    expect(Object.values(state.iron ?? {})).toHaveLength(1);
  });

  it("adds gold", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(4),
          "Gold Rock": new Decimal(0),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
    });

    expect(state.inventory["Gold Rock"]).toEqual(new Decimal(1));
    expect(Object.values(state.gold ?? {})).toHaveLength(1);
  });

  it("adds plots", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(3),
          "Crop Plot": new Decimal(9),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
    });

    expect(state.inventory["Crop Plot"]).toEqual(new Decimal(9));
    expect(Object.values(state.crops ?? {})).toHaveLength(9);
  });

  it("adds sunstones", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(12),
          "Sunstone Rock": new Decimal(1),
        },
        island: {
          type: "spring",
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },

        sunstones: {
          "1": {
            x: -3,
            y: 3,
            minesLeft: 3,
            stone: {
              minedAt: 0,
            },
          },
        },
      },
    });

    expect(state.inventory["Sunstone Rock"]).toEqual(new Decimal(2));
    expect(Object.values(state.sunstones ?? {})).toHaveLength(2);
  });

  it("adds oil", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(14),
          "Oil Reserve": new Decimal(1),
        },
        island: {
          type: "desert",
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },

        oilReserves: {
          "123": {
            x: -3,
            y: 3,
            createdAt: 0,
            drilled: 1,
            oil: {
              drilledAt: 0,
            },
          },
        },
      },
    });

    expect(state.inventory["Oil Reserve"]).toEqual(new Decimal(2));
    expect(Object.values(state.oilReserves ?? {})).toHaveLength(2);
  });

  it("does not add sunstones if already dropped on previous expansion", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(12),
          "Sunstone Rock": new Decimal(1),
        },
        island: {
          type: "spring",
          sunstones: 2,
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },

        sunstones: {
          "1": {
            x: -3,
            y: 3,
            minesLeft: 3,
            stone: {
              minedAt: 0,
            },
          },
        },
      },
    });

    expect(state.inventory["Sunstone Rock"]).toEqual(new Decimal(1));
    expect(Object.values(state.sunstones ?? {})).toHaveLength(1);
  });

  it("replenishes trees", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        trees: {
          "1": {
            wood: {
              choppedAt: now - 2 * 60 * 1000,
            },
            x: -3,
            y: 3,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.trees[1].wood.choppedAt).toEqual(
      now - TREE_RECOVERY_TIME * 1000,
    );
  });

  it("replenishes stones", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        stones: {
          "1": {
            stone: {
              minedAt: now - 2 * 60 * 1000,
            },
            x: -3,
            y: 3,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.stones[1].stone.minedAt).toEqual(
      now - STONE_RECOVERY_TIME * 1000,
    );
  });

  it("replenishes iron", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        iron: {
          "1": {
            stone: {
              minedAt: now - 2 * 60 * 1000,
            },
            x: -3,
            y: 3,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.iron[1].stone.minedAt).toEqual(
      now - IRON_RECOVERY_TIME * 1000,
    );
  });

  it("replenishes gold", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        gold: {
          "1": {
            stone: {
              minedAt: now - 2 * 60 * 1000,
            },
            x: -3,
            y: 3,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.gold[1].stone.minedAt).toEqual(
      now - GOLD_RECOVERY_TIME * 1000,
    );
  });

  it("replenishes crimstones", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...INITIAL_FARM,
        crimstones: {
          "1": {
            createdAt: 0,
            minesLeft: 1,
            stone: {
              minedAt: now - 2 * 60 * 1000,
              criticalHit: { Native: 1 },
            },
            x: -3,
            y: 3,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.crimstones[1]).toEqual<FiniteResource>({
      minesLeft: 1,
      stone: {
        minedAt: now - CRIMSTONE_RECOVERY_TIME * 1000,
        criticalHit: { Native: 1 },
      },
      createdAt: 0,
      x: -3,
      y: 3,
    });
  });

  it("sets the mineAt for removed crimstones", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...INITIAL_FARM,
        crimstones: {
          "1": {
            createdAt: 0,
            minesLeft: 1,
            stone: {
              minedAt: now - 2 * 60 * 1000,
              criticalHit: { Native: 1 },
            },
            removedAt: now - 2 * 60 * 1000,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.crimstones[1]).toEqual<FiniteResource>({
      minesLeft: 1,
      stone: {
        minedAt: now - 2 * 60 * 1000 - CRIMSTONE_RECOVERY_TIME * 1000,
        criticalHit: { Native: 1 },
      },
      removedAt: now - 2 * 60 * 1000,
      createdAt: 0,
    });
  });

  it("replenishes oilReserves", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...TEST_FARM,
        oilReserves: {
          "1": {
            createdAt: 0,
            oil: {
              drilledAt: now - 2 * 60 * 1000,
            },
            drilled: 1,
            x: -3,
            y: 3,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.oilReserves[1].oil.drilledAt).toEqual(
      now - OIL_RESERVE_RECOVERY_TIME * 1000,
    );
  });

  it("ensures that the trees are not more than removedAt if replenished in inventory", () => {
    const now = Date.now();

    const INITIAL_STATE = {
      ...TEST_FARM,
      trees: {
        "1": {
          createdAt: 100000000,
          wood: {
            choppedAt: now - 8 * 60 * 60 * 1000,
          },
          removedAt: now - 6 * 60 * 60 * 1000,
        },
      },
      inventory: {
        "Basic Land": new Decimal(4),
      },
      expansionConstruction: { createdAt: 0, readyAt: 0 },
    };

    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: INITIAL_STATE,
      createdAt: now,
    });

    expect(state.trees[1].wood.choppedAt).toBeLessThan(
      state.trees[1].removedAt!,
    );
  });

  // A player who expands onto an island with sunstones but was never granted
  // them (and never mined any) should be airdropped the missing rocks.
  const revealMissingSunstones = (sunstoneMined?: number) =>
    revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...INITIAL_FARM,
        island: {
          type: "volcano",
        },
        inventory: {
          "Basic Land": new Decimal(5),
          "Sunstone Rock": new Decimal(0), // Never received any sunstones
        },
        farmActivity:
          sunstoneMined === undefined
            ? {}
            : { "Sunstone Mined": sunstoneMined },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: Date.now(),
    });

  const missingSunstoneAirdrop = (sunstoneMined?: number) =>
    revealMissingSunstones(sunstoneMined).airdrops?.find((a) =>
      a.id.startsWith("missing-resources"),
    )?.items["Sunstone Rock"] ?? 0;

  it("airdrops missing sunstones for a player who has never mined", () => {
    // Previously sunstones were never airdropped at all (bug); now they are.
    expect(missingSunstoneAirdrop()).toBeGreaterThan(0);
  });

  it("only airdrops sunstones the player has not mined to depletion", () => {
    const baseline = missingSunstoneAirdrop(); // never mined

    // Mining 20 times depletes 2 rocks (10 mines each), so 2 fewer are granted.
    expect(missingSunstoneAirdrop(20)).toBe(baseline - 2);
    // A partial rock (fewer than 10 mines) does not reduce the grant.
    expect(missingSunstoneAirdrop(9)).toBe(baseline);
  });

  // Regression: a player who expanded the desert before sunstones existed there
  // is owed the full desert sunstone total once they expand again. Desert
  // expects 6 sunstones by expansion 25.
  it("airdrops missing desert sunstones (expansion 24 -> 25)", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },

      state: {
        ...INITIAL_FARM,
        island: {
          type: "desert",
        },
        inventory: {
          "Basic Land": new Decimal(24),
          "Sunstone Rock": new Decimal(0),
        },
        farmActivity: {},
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: Date.now(),
    });

    const airdrop = state.airdrops?.find((a) =>
      a.id.startsWith("missing-resources"),
    );

    expect(airdrop?.items["Sunstone Rock"]).toBe(
      TOTAL_EXPANSION_NODES.desert[25]["Sunstone Rock"],
    );
  });

  const sunstonesGranted = (airdrops: ReturnType<typeof getRewards>) =>
    airdrops
      .filter((a) => a.id.startsWith("missing-resources"))
      .reduce((total, a) => total + (a.items["Sunstone Rock"] ?? 0), 0);

  it("does not count partially mined live rocks as depletions", () => {
    const grant = (sunstones: Record<string, FiniteResource>, mined: number) =>
      sunstonesGranted(
        getRewards({
          game: {
            ...INITIAL_FARM,
            island: { type: "volcano" },
            inventory: {
              "Basic Land": new Decimal(6),
              "Sunstone Rock": new Decimal(0),
            },
            sunstones,
            farmActivity: { "Sunstone Mined": mined },
          },
          createdAt: Date.now(),
        }),
      );

    const baseline = grant({}, 0);
    expect(baseline).toBe(TOTAL_EXPANSION_NODES.volcano[6]["Sunstone Rock"]);

    // 10 lifetime mines with no live rocks => one rock was mined to depletion.
    expect(grant({}, 10)).toBe(baseline - 1);

    // 10 lifetime mines spread across 2 live rocks (none depleted) => no
    // depletion, so the full missing amount is still granted.
    expect(
      grant(
        {
          "1": { stone: { minedAt: 0 }, minesLeft: 5, createdAt: 0 },
          "2": { stone: { minedAt: 0 }, minesLeft: 5, createdAt: 0 },
        },
        10,
      ),
    ).toBe(baseline);
  });

  it("does not re-grant resources promised by a pending missing-resources airdrop", () => {
    // With no pending airdrop, the missing sunstones are reported.
    const granted = sunstonesGranted(
      getRewards({
        game: {
          ...INITIAL_FARM,
          island: { type: "volcano" },
          inventory: {
            "Basic Land": new Decimal(6),
            "Sunstone Rock": new Decimal(0),
          },
          farmActivity: {},
        },
        createdAt: Date.now(),
      }),
    );
    expect(granted).toBe(TOTAL_EXPANSION_NODES.volcano[6]["Sunstone Rock"]);

    // The same sunstones already sit in an unclaimed airdrop, so they must not
    // be reported missing (and re-granted) a second time.
    const withPending = sunstonesGranted(
      getRewards({
        game: {
          ...INITIAL_FARM,
          island: { type: "volcano" },
          inventory: {
            "Basic Land": new Decimal(6),
            "Sunstone Rock": new Decimal(0),
          },
          farmActivity: {},
          airdrops: [
            {
              id: "missing-resources-6",
              createdAt: 0,
              items: { "Sunstone Rock": granted },
              wearables: {},
              sfl: 0,
              coins: 0,
            },
          ],
        },
        createdAt: Date.now(),
      }),
    );
    expect(withPending).toBe(0);
  });

  // The sunstone depletion and pending-airdrop changes must not alter how
  // forged/upgraded nodes (e.g. Ancient Tree) are granted.
  it("grants forged nodes and dedups them against pending airdrops", () => {
    const ancientTreesGranted = (airdrops?: ReturnType<typeof getRewards>) =>
      getRewards({
        game: {
          ...INITIAL_FARM,
          island: { type: "spring" },
          inventory: { "Basic Land": new Decimal(7) },
          farmActivity: { "Ancient Tree Upgrade": 1 },
          ...(airdrops ? { airdrops } : {}),
        },
        createdAt: Date.now(),
      })
        .filter((a) => a.id.startsWith("missing-resources"))
        .reduce((total, a) => total + (a.items["Ancient Tree"] ?? 0), 0);

    // A forged Ancient Tree the player no longer holds is still granted.
    expect(ancientTreesGranted()).toBe(1);

    // ...but it is not re-granted while it sits in an unclaimed airdrop.
    expect(
      ancientTreesGranted([
        {
          id: "missing-resources-7",
          createdAt: 0,
          items: { "Ancient Tree": 1 },
          wearables: {},
          sfl: 0,
          coins: 0,
        },
      ]),
    ).toBe(0);
  });
});
