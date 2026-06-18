import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import {
  LAND_4_LAYOUT,
  SPRING_LAND_5_LAYOUT,
  getExpectedResources,
  getExpansionNodes,
  getExpansionRequirements,
  getLand,
} from "./expansions";
import { upgradeRock } from "../events/landExpansion/upgradeRock";
import { SWAMP_BASE_NODES } from "../expansion/lib/ascension";

describe("getLand", () => {
  it("returns a basic land", () => {
    const land = getLand({
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(3),
        },
      },
    });

    expect(land).toEqual(LAND_4_LAYOUT());
  });

  it("returns a spring land", () => {
    const land = getLand({
      game: {
        ...TEST_FARM,
        island: {
          type: "spring",
        },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(4),
        },
      },
    });

    expect(land).toEqual(SPRING_LAND_5_LAYOUT());
  });

  it("does not return resources if player already has expected resources", () => {
    const land = getLand({
      game: {
        ...TEST_FARM,
        island: {
          type: "spring",
        },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(4),
          "Crop Plot": new Decimal(44),
          "Ancient Tree": new Decimal(1),
          Tree: new Decimal(18),
          "Stone Rock": new Decimal(12),
          "Iron Rock": new Decimal(6),
          "Gold Rock": new Decimal(3),
          "Fruit Patch": new Decimal(4),
        },
      },
    });

    expect(land?.trees).toEqual([]);
    expect(land?.stones).toEqual([]);
    expect(land?.gold).toEqual([]);
    expect(land?.iron).toEqual([]);
    expect(land?.fruitPatches).toEqual([]);
    expect(land?.plots).toEqual([]);
  });

  it("only returns spring resources if they previously had basic resources", () => {
    const land = getLand({
      game: {
        ...TEST_FARM,
        island: {
          type: "spring",
        },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(5),
          "Crop Plot": new Decimal(44),
          Tree: new Decimal(22),
          "Stone Rock": new Decimal(12),
          "Iron Rock": new Decimal(6),
          "Gold Rock": new Decimal(3),
          "Fruit Patch": new Decimal(4),
        },
      },
    });

    expect(land?.trees).toEqual([]);
    expect(land?.stones).toEqual([]);
    expect(land?.gold).toEqual([]);
    expect(land?.iron).toEqual([]);
    expect(land?.fruitPatches).toEqual([]);
    expect(land?.plots).toEqual([]);
    expect(land?.beehives).toHaveLength(1);
    expect(land?.flowerBeds).toHaveLength(1);
  });

  // Flower bed and honey temp disabled
  it.skip("returns spring resources if they had bought resource nodes", () => {
    const land = getLand({
      game: {
        ...TEST_FARM,
        island: {
          type: "spring",
        },
        farmActivity: {
          "Beehive Bought": 1,
          "Flower Bed Bought": 1,
        },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(5),
          "Crop Plot": new Decimal(44),
          Tree: new Decimal(22),
          "Stone Rock": new Decimal(12),
          "Iron Rock": new Decimal(6),
          "Gold Rock": new Decimal(3),
          "Fruit Patch": new Decimal(4),
          Beehive: new Decimal(1),
          "Flower Bed": new Decimal(1),
        },
      },
    });

    expect(land?.trees).toEqual([]);
    expect(land?.stones).toEqual([]);
    expect(land?.gold).toEqual([]);
    expect(land?.iron).toEqual([]);
    expect(land?.fruitPatches).toEqual([]);
    expect(land?.plots).toEqual([]);
    expect(land?.beehives).toHaveLength(1);
    expect(land?.flowerBeds).toHaveLength(1);
  });
});

describe("getExpectedResources", () => {
  it("returns the correct resources when upgrading from L1 -> L2", () => {
    const island = "basic";
    const expansion = 7;
    const farm = upgradeRock({
      action: {
        type: "rock.upgraded",
        upgradeTo: "Fused Stone Rock",
        id: "new-stone",
      },
      state: {
        ...TEST_FARM,
        coins: 50000,
        inventory: {
          ...TEST_FARM.inventory,
          Obsidian: new Decimal(10),
          "Stone Rock": new Decimal(5),
        },
        stones: {
          "1": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 0,
            y: 0,
          },
          "2": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 0,
          },
          "3": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
          "4": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 3,
            y: 0,
          },
        },
      },
    });

    const resources = getExpectedResources({
      game: {
        ...farm,
        inventory: {
          ...farm.inventory,
        },
        island: {
          type: island,
        },
      },
      expansion,
    });

    expect(resources["Stone Rock"]).toEqual(2);
    expect(resources["Fused Stone Rock"]).toEqual(1);
  });

  it("returns the correct resources when upgrading from L2 -> L3", () => {
    const resources = getExpectedResources({
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Stone Rock": new Decimal(4),
          "Reinforced Stone Rock": new Decimal(1),
        },
        farmActivity: {
          "Fused Stone Rock Upgrade": 4,
          "Reinforced Stone Rock Upgrade": 1,
        },
        island: {
          type: "volcano",
        },
      },
      expansion: 9,
    });

    expect(resources["Stone Rock"]).toEqual(4);
    expect(resources["Fused Stone Rock"]).toEqual(0);
    expect(resources["Reinforced Stone Rock"]).toEqual(1);
  });

  it("returns 20 when on spring expansion 16 (18 trees) and have purchased 2 trees", () => {
    const resources = getExpectedResources({
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
        },
        farmActivity: {
          "Tree Bought": 2,
        },
        island: {
          type: "spring",
        },
      },
      expansion: 16,
    });

    expect(resources.Tree).toEqual(20);
  });

  it("returns 16 when on spring expansion 16 (18 trees) and have purchased 2 trees, and upgraded 1 ancient tree", () => {
    const resources = getExpectedResources({
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
        },
        farmActivity: {
          "Tree Bought": 2,
          "Ancient Tree Upgrade": 1,
        },
        island: {
          type: "spring",
        },
      },
      expansion: 16,
    });

    expect(resources.Tree).toEqual(16);
  });

  it("returns 4 when on spring expansion 16 (18 trees) and have purchased 2 trees, and upgraded 1 sacred tree and 4 ancient trees", () => {
    const resources = getExpectedResources({
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
        },
        farmActivity: {
          "Tree Bought": 2,
          "Ancient Tree Upgrade": 4,
          "Sacred Tree Upgrade": 1,
        },
        island: {
          type: "spring",
        },
      },
      expansion: 16,
    });

    expect(resources.Tree).toEqual(4);
  });

  it("returns 0 when on spring expansion 16 (18 trees) and have purchased 2 trees, and upgraded 1 sacred tree and 5 ancient trees", () => {
    const resources = getExpectedResources({
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
        },
        farmActivity: {
          "Tree Bought": 2,
          "Ancient Tree Upgrade": 5,
          "Sacred Tree Upgrade": 1,
        },
        island: {
          type: "spring",
        },
      },
      expansion: 16,
    });

    expect(resources.Tree).toEqual(0);
  });

  it("returns 0 when on spring expansion 16 (18 trees) and have purchased 2 trees, and upgraded 1 sacred tree and 5 ancient trees", () => {
    const resources = getExpectedResources({
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
        },
        farmActivity: {
          "Tree Bought": 2,
          "Ancient Tree Upgrade": 5,
          "Sacred Tree Upgrade": 1,
        },
        island: {
          type: "spring",
        },
      },
      expansion: 16,
    });

    expect(resources.Tree).toEqual(0);
  });

  it("returns 5 ancient trees when on spring expansion 16 (18 trees) and upgraded 5 ancient trees", () => {
    const resources = getExpectedResources({
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
        },
        farmActivity: {
          "Tree Bought": 2,
          "Ancient Tree Upgrade": 5,
        },
        island: {
          type: "spring",
        },
      },
      expansion: 16,
    });

    expect(resources["Ancient Tree"]).toEqual(5);
  });

  it("returns 1 ancient tree when on spring expansion 16 (18 trees) and upgraded 1 sacred tree and 5 ancient trees", () => {
    const resources = getExpectedResources({
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
        },
        farmActivity: {
          "Tree Bought": 2,
          "Ancient Tree Upgrade": 5,
          "Sacred Tree Upgrade": 1,
        },
        island: {
          type: "spring",
        },
      },
      expansion: 16,
    });

    expect(resources["Ancient Tree"]).toEqual(1);
  });

  it("returns 1 sacred tree when on spring expansion 16 (18 trees) and upgraded 1 sacred tree and 5 ancient trees", () => {
    const resources = getExpectedResources({
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
        },
        farmActivity: {
          "Tree Bought": 2,
          "Ancient Tree Upgrade": 5,
          "Sacred Tree Upgrade": 1,
        },
        island: {
          type: "spring",
        },
      },
      expansion: 16,
    });

    expect(resources["Sacred Tree"]).toEqual(1);
  });
});

describe("getExpansionNodes", () => {
  it("delegates to TOTAL_EXPANSION_NODES for a static island without ascensionLevel", () => {
    const nodes = getExpansionNodes({
      island: "basic",
      expansion: 4,
    });
    // basic expansion 4 adds the first plots/trees from the hand-authored layout
    expect(typeof nodes["Crop Plot"]).toBe("number");
    expect(nodes["Crop Plot"]).toBeGreaterThan(0);
  });

  it("returns SWAMP_BASE_NODES for swamp expansion 30 at ascensionLevel 1", () => {
    const nodes = getExpansionNodes({
      island: "swamp",
      expansion: 30,
      ascensionLevel: 1,
    });
    expect(nodes).toEqual(SWAMP_BASE_NODES);
  });

  it("returns base nodes unchanged at expansion 31 (e=1, no drip fires at globalE=1)", () => {
    const nodes = getExpansionNodes({
      island: "swamp",
      expansion: 31,
      ascensionLevel: 1,
    });
    // globalE=1: no drip modulo hits at 1 for any node, so cumulative = base floor
    expect(nodes).toEqual(SWAMP_BASE_NODES);
  });

  it("adds one Crop Plot at expansion 32 (e=2, globalE=2, drip=2 fires)", () => {
    const nodes = getExpansionNodes({
      island: "swamp",
      expansion: 32,
      ascensionLevel: 1,
    });
    expect(nodes["Crop Plot"]).toBe(SWAMP_BASE_NODES["Crop Plot"] + 1);
    // All other node types unchanged from base
    expect(nodes.Tree).toBe(SWAMP_BASE_NODES.Tree);
  });

  it("returns higher node totals for ascensionLevel 2 vs 1 at the same expansion", () => {
    const nodesA1 = getExpansionNodes({
      island: "swamp",
      expansion: 42,
      ascensionLevel: 1,
    });
    const nodesA2 = getExpansionNodes({
      island: "swamp",
      expansion: 42,
      ascensionLevel: 2,
    });
    // Each successive ascension carries forward all prior drips, so totals grow
    expect(nodesA2["Crop Plot"]).toBeGreaterThan(nodesA1["Crop Plot"]);
    expect(nodesA2["Tree"]).toBeGreaterThan(nodesA1["Tree"]);
  });

  it("ascensionLevel 0 is treated the same as no ascensionLevel (static path)", () => {
    const noAscension = getExpansionNodes({
      island: "basic",
      expansion: 4,
    });
    const zeroAscension = getExpansionNodes({
      island: "basic",
      expansion: 4,
      ascensionLevel: 0,
    });
    expect(zeroAscension).toEqual(noAscension);
  });
});

describe("getExpansionRequirements", () => {
  it("returns static EXPANSION_REQUIREMENTS for a basic island expansion", () => {
    const req = getExpansionRequirements({ island: "basic", expansion: 4 });
    expect(req).toEqual({
      resources: { Wood: 3 },
      seconds: 5,
      bumpkinLevel: 1,
    });
  });

  it("returns undefined for a static island expansion outside the table (expansion 3)", () => {
    const req = getExpansionRequirements({ island: "basic", expansion: 3 });
    expect(req).toBeUndefined();
  });

  it("returns formula requirements for swamp expansion 31 at ascensionLevel 1", () => {
    const HOUR = 60 * 60;
    const req = getExpansionRequirements({
      island: "swamp",
      expansion: 31,
      ascensionLevel: 1,
    });
    expect(req).toEqual({
      resources: { Crimstone: 30, Oil: 50, Obsidian: 3 },
      coins: 5000,
      seconds: 7 * HOUR,
      bumpkinLevel: 0,
    });
  });

  it("returns undefined for swamp expansion 30 (below the swamp range) at ascensionLevel 1", () => {
    const req = getExpansionRequirements({
      island: "swamp",
      expansion: 30,
      ascensionLevel: 1,
    });
    expect(req).toBeUndefined();
  });

  it("returns undefined for swamp expansion 43 (above the swamp range) at ascensionLevel 1", () => {
    const req = getExpansionRequirements({
      island: "swamp",
      expansion: 43,
      ascensionLevel: 1,
    });
    expect(req).toBeUndefined();
  });

  it("scales costs by 1.4 at ascensionLevel 2 while keeping seconds unchanged", () => {
    const HOUR = 60 * 60;
    const req = getExpansionRequirements({
      island: "swamp",
      expansion: 42,
      ascensionLevel: 2,
    });
    expect(req?.resources).toEqual({ Crimstone: 210, Oil: 560, Obsidian: 42 });
    expect(req?.coins).toBe(105000);
    expect(req?.seconds).toBe(84 * HOUR);
  });

  it("treats ascensionLevel 0 the same as no ascensionLevel (static path)", () => {
    const noAscension = getExpansionRequirements({
      island: "basic",
      expansion: 4,
    });
    const zeroAscension = getExpansionRequirements({
      island: "basic",
      expansion: 4,
      ascensionLevel: 0,
    });
    expect(zeroAscension).toEqual(noAscension);
  });
});

describe("getLand (ascension path)", () => {
  it("returns a non-null layout for a swamp island with ascensionLevel 1", () => {
    const land = getLand({
      game: {
        ...TEST_FARM,
        island: { type: "swamp", ascensionLevel: 1 },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(30),
        },
      },
    });
    expect(land).not.toBeNull();
    expect(land?.id).toBe("swamp_31");
  });

  it("overrides static island branch when ascensionLevel > 0", () => {
    // Even a known static island type is overridden by ascensionLevel > 0,
    // because the ascension check comes after and always wins.
    const land = getLand({
      game: {
        ...TEST_FARM,
        island: { type: "swamp", ascensionLevel: 2 },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(30),
        },
      },
    });
    expect(land).not.toBeNull();
    expect(land?.id).toBe("swamp_31");
  });

  it("includes a dripped Crop Plot at expansion 32 (e=2 fires Crop Plot drip)", () => {
    const land = getLand({
      game: {
        ...TEST_FARM,
        island: { type: "swamp", ascensionLevel: 1 },
        inventory: {
          // Set Crop Plot to 0 so all expected plots are available
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(31),
          "Crop Plot": new Decimal(0),
        },
      },
    });
    // Expansion 32 (e=2) drips exactly 1 Crop Plot; expected total = base(65) + 1 = 66.
    // With 0 owned, all 1 dripped plot should appear in the layout.
    expect(land?.plots).toHaveLength(1);
  });

  it("returns null when island type is unknown (no branch matches) and ascensionLevel is absent", () => {
    const land = getLand({
      game: {
        ...TEST_FARM,
        // Swamp with no ascensionLevel: none of the static branches match and
        // the ascension guard (ascensionLevel > 0) is also false.
        island: { type: "swamp" },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(30),
        },
      },
    });
    expect(land).toBeNull();
  });
});
