import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { createInitialAgingShed } from "features/game/lib/agingShed";
import {
  BUILDING_UPGRADES,
  getMaxBuildingUpgradeLevel,
  upgradeBuilding,
} from "./upgradeBuilding";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";

describe("upgradeBuilding", () => {
  it("throws an error if the building is not found", () => {
    expect(() =>
      upgradeBuilding({
        state: {
          ...TEST_FARM,
          buildings: {},
        },
        action: {
          type: "building.upgraded",
          buildingType: "Hen House",
        },
      }),
    ).toThrow("Building not found");
  });

  it("throws an error if the building is at the max level", () => {
    expect(() =>
      upgradeBuilding({
        state: {
          ...TEST_FARM,
          buildings: {
            "Hen House": [
              {
                id: "Hen House",
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
                createdAt: 0,
              },
            ],
          },
          henHouse: {
            ...TEST_FARM.henHouse,
            level: 3,
          },
        },
        action: {
          type: "building.upgraded",
          buildingType: "Hen House",
        },
      }),
    ).toThrow("Building is at max level");
  });

  it("throws an error if player doesn't have enough coins", () => {
    expect(() =>
      upgradeBuilding({
        state: {
          ...TEST_FARM,
          coins: 7499, // Not enough coins for level 2 upgrade
          buildings: {
            "Hen House": [
              {
                id: "Hen House",
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
                createdAt: 0,
              },
            ],
          },
          henHouse: {
            ...TEST_FARM.henHouse,
            level: 1,
          },
          inventory: {
            Wood: new Decimal(500),
            Iron: new Decimal(50),
            Gold: new Decimal(40),
            Crimstone: new Decimal(10),
          },
        },
        action: {
          type: "building.upgraded",
          buildingType: "Hen House",
        },
      }),
    ).toThrow("Insufficient coins for upgrade");
  });

  it("throws an error if player doesn't have enough items", () => {
    expect(() =>
      upgradeBuilding({
        state: {
          ...TEST_FARM,
          coins: 7500, // Enough coins for level 2 upgrade
          buildings: {
            "Hen House": [
              {
                id: "Hen House",
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
                createdAt: 0,
              },
            ],
          },
          henHouse: {
            ...TEST_FARM.henHouse,
            level: 1,
          },
          inventory: {
            Wood: new Decimal(499), // Not enough Wood
            Iron: new Decimal(50),
            Gold: new Decimal(40),
            Crimstone: new Decimal(10),
          },
        },
        action: {
          type: "building.upgraded",
          buildingType: "Hen House",
        },
      }),
    ).toThrow("Insufficient Wood for upgrade");
  });

  it("takes the cost of the upgrade from the player", () => {
    const state = {
      ...TEST_FARM,
      coins: 7500,
      buildings: {
        "Hen House": [
          {
            id: "Hen House",
            coordinates: { x: 0, y: 0 },
            readyAt: 0,
            createdAt: 0,
          },
        ],
      },
      henHouse: {
        ...TEST_FARM.henHouse,
        level: 1,
      },
      inventory: {
        Wood: new Decimal(501),
        Iron: new Decimal(51),
        Gold: new Decimal(41),
        Crimstone: new Decimal(11),
      },
    };

    const result = upgradeBuilding({
      state,
      action: {
        type: "building.upgraded",
        buildingType: "Hen House",
      },
    });

    expect(result.coins).toEqual(0);
    expect(result.inventory.Wood).toEqual(new Decimal(1));
    expect(result.inventory.Iron).toEqual(new Decimal(1));
    expect(result.inventory.Gold).toEqual(new Decimal(1));
    expect(result.inventory.Crimstone).toEqual(new Decimal(1));
  });

  it("upgrades the building level", () => {
    const state = {
      ...TEST_FARM,
      coins: 7500,
      buildings: {
        "Hen House": [
          {
            id: "Hen House",
            coordinates: { x: 0, y: 0 },
            readyAt: 0,
            createdAt: 0,
          },
        ],
      },
      inventory: {
        Wood: new Decimal(501),
        Iron: new Decimal(51),
        Gold: new Decimal(41),
        Crimstone: new Decimal(11),
      },
      henHouse: {
        ...TEST_FARM.henHouse,
        level: 1,
      },
    };

    const result = upgradeBuilding({
      state,
      action: {
        type: "building.upgraded",
        buildingType: "Hen House",
      },
    });

    expect(result.henHouse.level).toEqual(2);
  });

  it("upgrades the water well level", () => {
    const state = {
      ...TEST_FARM,
      coins: 7500,
      bumpkin: {
        ...TEST_FARM.bumpkin,
        experience: LEVEL_EXPERIENCE[20],
      },
      buildings: {
        "Water Well": [
          {
            id: "Water Well",
            coordinates: { x: 0, y: 0 },
            readyAt: 0,
            createdAt: 0,
          },
        ],
      },
      inventory: {
        Wood: new Decimal(501),
        Stone: new Decimal(501),
      },
      waterWell: {
        ...TEST_FARM.waterWell,
        level: 1,
      },
    };

    const result = upgradeBuilding({
      state,
      action: {
        type: "building.upgraded",
        buildingType: "Water Well",
      },
    });
    expect(result.waterWell.level).toEqual(2);
  });

  it("tracks the bumpkin activity", () => {
    const state = {
      ...TEST_FARM,
      coins: 50000,
      buildings: {
        "Hen House": [
          {
            id: "Hen House",
            coordinates: { x: 0, y: 0 },
            readyAt: 0,
            createdAt: 0,
          },
        ],
      },
      henHouse: {
        ...TEST_FARM.henHouse,
        level: 2,
      },
      inventory: {
        Wood: new Decimal(2500),
        Iron: new Decimal(150),
        Gold: new Decimal(100),
        Crimstone: new Decimal(50),
        Oil: new Decimal(100),
      },
    };

    const result = upgradeBuilding({
      state,
      action: {
        type: "building.upgraded",
        buildingType: "Hen House",
      },
    });

    expect(result.farmActivity["Coins Spent"]).toBe(50000);
  });

  describe("Aging Shed", () => {
    const agingShedBuildings = {
      "Aging Shed": [
        {
          id: "Aging Shed",
          coordinates: { x: 0, y: 0 },
          readyAt: 0,
          createdAt: 0,
        },
      ],
    };

    it("throws when at max level", () => {
      expect(() =>
        upgradeBuilding({
          state: {
            ...TEST_FARM,
            buildings: agingShedBuildings,
            agingShed: { ...createInitialAgingShed(), level: 6 },
            coins: 2_000_000,
          },
          action: {
            type: "building.upgraded",
            buildingType: "Aging Shed",
          },
        }),
      ).toThrow("Building is at max level");
    });

    it("throws when player does not have enough coins (1 → 2)", () => {
      expect(() =>
        upgradeBuilding({
          state: {
            ...TEST_FARM,
            buildings: agingShedBuildings,
            agingShed: { ...createInitialAgingShed(), level: 1 },
            coins: 2_999,
            inventory: {
              ...TEST_FARM.inventory,
              Stone: new Decimal(100),
              Gold: new Decimal(20),
            },
          },
          action: {
            type: "building.upgraded",
            buildingType: "Aging Shed",
          },
        }),
      ).toThrow("Insufficient coins for upgrade");
    });

    it("throws when player does not have enough Stone (1 → 2)", () => {
      expect(() =>
        upgradeBuilding({
          state: {
            ...TEST_FARM,
            buildings: agingShedBuildings,
            agingShed: { ...createInitialAgingShed(), level: 1 },
            coins: 3_000,
            inventory: {
              ...TEST_FARM.inventory,
              Stone: new Decimal(99),
              Gold: new Decimal(20),
            },
          },
          action: {
            type: "building.upgraded",
            buildingType: "Aging Shed",
          },
        }),
      ).toThrow("Insufficient Stone for upgrade");
    });

    it("throws when player does not have enough Gold (1 → 2)", () => {
      expect(() =>
        upgradeBuilding({
          state: {
            ...TEST_FARM,
            buildings: agingShedBuildings,
            agingShed: { ...createInitialAgingShed(), level: 1 },
            coins: 3_000,
            inventory: {
              ...TEST_FARM.inventory,
              Stone: new Decimal(100),
              Gold: new Decimal(19),
            },
          },
          action: {
            type: "building.upgraded",
            buildingType: "Aging Shed",
          },
        }),
      ).toThrow("Insufficient Gold for upgrade");
    });

    it.each([
      {
        name: "1 → 2",
        fromLevel: 1,
        toLevel: 2,
        coinCost: 3_000,
        startingCoins: 8_000,
        inventory: {
          Stone: new Decimal(101),
          Gold: new Decimal(21),
        },
        expectedInventory: {
          Stone: new Decimal(1),
          Gold: new Decimal(1),
        },
      },
      {
        name: "2 → 3",
        fromLevel: 2,
        toLevel: 3,
        coinCost: 4_000,
        startingCoins: 9_000,
        inventory: {
          Wood: new Decimal(501),
          Stone: new Decimal(501),
        },
        expectedInventory: {
          Wood: new Decimal(1),
          Stone: new Decimal(1),
        },
      },
      {
        name: "3 → 4",
        fromLevel: 3,
        toLevel: 4,
        coinCost: 10_000,
        startingCoins: 15_000,
        inventory: {
          Gold: new Decimal(101),
        },
        expectedInventory: {
          Gold: new Decimal(1),
        },
      },
      {
        name: "4 → 5",
        fromLevel: 4,
        toLevel: 5,
        coinCost: 20_000,
        startingCoins: 25_000,
        inventory: {
          Crimstone: new Decimal(11),
        },
        expectedInventory: {
          Crimstone: new Decimal(1),
        },
      },
      {
        name: "5 → 6",
        fromLevel: 5,
        toLevel: 6,
        coinCost: 100_000,
        startingCoins: 105_000,
        inventory: {},
        expectedInventory: {},
      },
    ])(
      "applies the correct cost and level for Aging Shed upgrade ($name)",
      ({
        fromLevel,
        toLevel,
        coinCost,
        startingCoins,
        inventory,
        expectedInventory,
      }) => {
        const state = {
          ...TEST_FARM,
          buildings: agingShedBuildings,
          agingShed: { ...createInitialAgingShed(), level: fromLevel },
          coins: startingCoins,
          inventory: {
            ...TEST_FARM.inventory,
            ...inventory,
          },
        };

        const result = upgradeBuilding({
          state,
          action: {
            type: "building.upgraded",
            buildingType: "Aging Shed",
          },
        });

        expect(result.agingShed.level).toEqual(toLevel);
        expect(result.coins).toEqual(startingCoins - coinCost);
        expect(result.farmActivity["Coins Spent"]).toBe(coinCost);
        Object.entries(expectedInventory).forEach(([item, expected]) => {
          expect(
            result.inventory[item as keyof typeof result.inventory],
          ).toEqual(expected);
        });
      },
    );

    it("throws when player does not have enough Wood (2 → 3)", () => {
      expect(() =>
        upgradeBuilding({
          state: {
            ...TEST_FARM,
            buildings: agingShedBuildings,
            agingShed: { ...createInitialAgingShed(), level: 2 },
            coins: 50_000,
            inventory: {
              ...TEST_FARM.inventory,
              Wood: new Decimal(499),
              Stone: new Decimal(500),
            },
          },
          action: {
            type: "building.upgraded",
            buildingType: "Aging Shed",
          },
        }),
      ).toThrow("Insufficient Wood for upgrade");
    });
  });
});

describe("getMaxBuildingUpgradeLevel", () => {
  it("uses the largest numeric tier key, not the number of entries", () => {
    expect(
      getMaxBuildingUpgradeLevel({
        2: { coins: 0, items: {} },
        3: { coins: 0, items: {} },
      }),
    ).toBe(3);
  });

  it("handles sparse numeric keys (max key can exceed entry count)", () => {
    expect(
      getMaxBuildingUpgradeLevel({
        2: { coins: 0, items: {} },
        5: { coins: 0, items: {} },
      }),
    ).toBe(5);
  });

  it("returns 1 when only tier 1 is defined", () => {
    expect(getMaxBuildingUpgradeLevel({ 1: { coins: 0, items: {} } })).toBe(1);
  });

  it("matches Aging Shed max tier in BUILDING_UPGRADES", () => {
    expect(getMaxBuildingUpgradeLevel(BUILDING_UPGRADES["Aging Shed"])).toBe(6);
  });

  it("matches Hen House max tier in BUILDING_UPGRADES", () => {
    expect(getMaxBuildingUpgradeLevel(BUILDING_UPGRADES["Hen House"])).toBe(3);
  });
});
