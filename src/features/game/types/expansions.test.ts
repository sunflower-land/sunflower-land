import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import {
  LAND_4_LAYOUT,
  SPRING_LAND_5_LAYOUT,
  getExpectedResources,
  getLand,
} from "./expansions";
import { upgradeRock } from "../events/landExpansion/upgradeRock";

const s = TEST_FARM;
describe("getLand", () => {
  it("returns a basic land", () => {
    const land = getLand({
      id: 1,
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
      id: 1,
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
      id: 1,
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
      id: 1,
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
      id: 1,
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

  it("returns 20 when on spring expansion 20 (18 trees) and have purchased 2 trees", () => {
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
      expansion: 20,
    });

    expect(resources.Tree).toEqual(20);
  });

  it("returns 16 when on spring expansion 20 (18 trees) and have purchased 2 trees, and upgraded 1 ancient tree", () => {
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
      expansion: 20,
    });

    expect(resources.Tree).toEqual(16);
  });

  it("returns 4 when on spring expansion 20 (18 trees) and have purchased 2 trees, and upgraded 1 sacred tree and 4 ancient trees", () => {
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
      expansion: 20,
    });

    expect(resources.Tree).toEqual(4);
  });

  it("returns 0 when on spring expansion 20 (18 trees) and have purchased 2 trees, and upgraded 1 sacred tree and 5 ancient trees", () => {
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
      expansion: 20,
    });

    expect(resources.Tree).toEqual(0);
  });

  it("returns 0 when on spring expansion 20 (18 trees) and have purchased 2 trees, and upgraded 1 sacred tree and 5 ancient trees", () => {
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
      expansion: 20,
    });

    expect(resources.Tree).toEqual(0);
  });

  it("returns 5 ancient trees when on spring expansion 20 (18 trees) and upgraded 5 ancient trees", () => {
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
      expansion: 20,
    });

    expect(resources["Ancient Tree"]).toEqual(5);
  });

  it("returns 1 ancient tree when on spring expansion 20 (18 trees) and upgraded 1 sacred tree and 5 ancient trees", () => {
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
      expansion: 20,
    });

    expect(resources["Ancient Tree"]).toEqual(1);
  });

  it("returns 1 sacred tree when on spring expansion 20 (18 trees) and upgraded 1 sacred tree and 5 ancient trees", () => {
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
      expansion: 20,
    });

    expect(resources["Sacred Tree"]).toEqual(1);
  });
});
