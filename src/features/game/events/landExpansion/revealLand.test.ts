import Decimal from "decimal.js-light";
import { expansionRequirements, getRewards, revealLand } from "./revealLand";
import {
  CRIMSTONE_RECOVERY_TIME,
  GOLD_RECOVERY_TIME,
  IRON_RECOVERY_TIME,
  STONE_RECOVERY_TIME,
  TEST_FARM,
  TREE_RECOVERY_TIME,
} from "features/game/lib/constants";
import {
  EXPANSION_REQUIREMENTS,
  SPRING_LAYOUTS,
  getBasicLand,
} from "features/game/types/expansions";
import {
  Nodes,
  TOTAL_EXPANSION_NODES,
} from "features/game/expansion/lib/expansionNodes";

describe("expansionRequirements", () => {
  it("returns normal expansion requirements", () => {
    const requirements = expansionRequirements({ game: TEST_FARM });

    expect(requirements?.resources).toEqual({
      Wood: 3,
    });
  });
  it("returns discounted expansion requirements with Grinx Hammer", () => {
    const requirements = expansionRequirements({
      game: {
        ...TEST_FARM,
        collectibles: {
          "Grinx's Hammer": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now(),
              id: "123",
              readyAt: Date.now(),
            },
          ],
        },
      },
    });

    expect(requirements?.resources).toEqual({
      Wood: 1.5,
    });
  });
});

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
      EXPANSION_REQUIREMENTS.basic[10].resources
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
      EXPANSION_REQUIREMENTS.basic[23].resources
    );
  });

  it("does not return anymore rewards if player has no more expansion refunds", () => {
    const rewards = getRewards({
      game: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(5),
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
      EXPANSION_REQUIREMENTS.spring[17].resources
    );
  });
});

describe("totalExpansions", () => {
  it("should have the correct amount of nodes for each basic expansion", () => {
    // Starting nodes
    const nodes: Nodes = {
      "Crimstone Rock": 0,
      "Crop Plot": 9,
      "Flower Bed": 0,
      "Fruit Patch": 0,
      "Gold Rock": 0,
      "Iron Rock": 0,
      "Stone Rock": 2,
      "Sunstone Rock": 0,
      Beehive: 0,
      Tree: 3,
      "Oil Reserve": 0,
    };

    let expansion = 4;
    while (expansion <= 9 && getBasicLand({ id: 1, expansion })) {
      const layout = getBasicLand({ id: 1, expansion });

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
        farmId: 1,
        state: {
          ...TEST_FARM,
          expansionConstruction: { createdAt: 0, readyAt: 0 },
          inventory: { "Basic Land": new Decimal(1000) },
        },
      })
    ).toThrow("Land Does Not Exists");
  });

  it("requires land is under construction", () => {
    expect(() =>
      revealLand({
        action: {
          type: "land.revealed",
        },
        farmId: 1,
        state: {
          ...TEST_FARM,
          inventory: { "Basic Land": new Decimal(1000) },
        },
      })
    ).toThrow("Land is not in construction");
  });

  it("removes land in construction", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },
      farmId: 1,
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(3),
          Stone: new Decimal(5),
          "Block Buck": new Decimal(3),
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
      farmId: 1,
      createdAt: now,
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(3),
          Stone: new Decimal(5),
          "Block Buck": new Decimal(3),
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
      farmId: 1,
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
      farmId: 1,
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
      farmId: 1,
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
      farmId: 1,
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
      farmId: 1,
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(3),
          "Crop Plot": new Decimal(9),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
    });

    expect(state.inventory["Crop Plot"]).toEqual(new Decimal(17));
    expect(Object.values(state.crops ?? {})).toHaveLength(17);
  });

  it("adds sunstones", () => {
    const state = revealLand({
      action: {
        type: "land.revealed",
      },
      farmId: 1,
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(17),
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
            height: 2,
            width: 2,
            minesLeft: 3,
            stone: {
              amount: 1,
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
      farmId: 1,
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
            height: 2,
            width: 2,
            createdAt: 0,
            drilled: 1,
            oil: {
              amount: 1,
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
      farmId: 1,
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(17),
          "Sunstone Rock": new Decimal(1),
        },
        island: {
          type: "spring",
          sunstones: 3,
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },

        sunstones: {
          "1": {
            x: -3,
            y: 3,
            height: 2,
            width: 2,
            minesLeft: 3,
            stone: {
              amount: 1,
              minedAt: 0,
            },
          },
        },
      },
    });

    expect(state.inventory["Sunstone Rock"]).toEqual(new Decimal(1));
    expect(Object.values(state.sunstones ?? {})).toHaveLength(1);
  });

  it("adds a reward on first expansion", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },
      farmId: 3,
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(3),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.airdrops).toContainEqual({
      createdAt: now,
      id: "expansion-four-airdrop",
      items: {
        Shovel: 1,
        "Block Buck": 1,
      },
      sfl: 0,
      coins: 0,
      wearables: {},
      coordinates: {
        x: 0,
        y: 8,
      },
    });
  });

  it("adds a reward on second expansion", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },
      farmId: 3,
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.airdrops).toContainEqual({
      createdAt: now,
      id: "expansion-fifth-airdrop",
      items: {
        "Time Warp Totem": 1,
        "Block Buck": 1,
      },
      sfl: 0,
      coins: 0,
      wearables: {},
      coordinates: {
        x: -7,
        y: 7,
      },
    });
  });

  it("replenishes trees", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },
      farmId: 3,
      state: {
        ...TEST_FARM,
        trees: {
          "1": {
            wood: {
              amount: 2,
              choppedAt: now - 2 * 60 * 1000,
            },
            x: -3,
            y: 3,
            height: 2,
            width: 2,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.trees[1].wood.choppedAt).toBeLessThan(
      now - TREE_RECOVERY_TIME * 1000
    );
  });

  it("replenishes stones", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },
      farmId: 3,
      state: {
        ...TEST_FARM,
        stones: {
          "1": {
            stone: {
              amount: 2,
              minedAt: now - 2 * 60 * 1000,
            },
            x: -3,
            y: 3,
            height: 2,
            width: 2,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.stones[1].stone.minedAt).toBeLessThan(
      now - STONE_RECOVERY_TIME * 1000
    );
  });

  it("replenishes iron", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },
      farmId: 3,
      state: {
        ...TEST_FARM,
        iron: {
          "1": {
            stone: {
              amount: 2,
              minedAt: now - 2 * 60 * 1000,
            },
            x: -3,
            y: 3,
            height: 2,
            width: 2,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.iron[1].stone.minedAt).toBeLessThan(
      now - IRON_RECOVERY_TIME * 1000
    );
  });

  it("replenishes gold", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },
      farmId: 3,
      state: {
        ...TEST_FARM,
        gold: {
          "1": {
            stone: {
              amount: 2,
              minedAt: now - 2 * 60 * 1000,
            },
            x: -3,
            y: 3,
            height: 2,
            width: 2,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.gold[1].stone.minedAt).toBeLessThan(
      now - GOLD_RECOVERY_TIME * 1000
    );
  });

  it("replenishes crimstones", () => {
    const now = Date.now();
    const state = revealLand({
      action: {
        type: "land.revealed",
      },
      farmId: 3,
      state: {
        ...TEST_FARM,
        crimstones: {
          "1": {
            minesLeft: 10,
            stone: {
              amount: 2,
              minedAt: now - 2 * 60 * 1000,
            },
            x: -3,
            y: 3,
            height: 2,
            width: 2,
          },
        },
        inventory: {
          "Basic Land": new Decimal(4),
        },
        expansionConstruction: { createdAt: 0, readyAt: 0 },
      },
      createdAt: now,
    });

    expect(state.crimstones[1].stone.minedAt).toBeLessThanOrEqual(
      now - CRIMSTONE_RECOVERY_TIME * 1000
    );
  });
});
