import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { upgradeBuilding } from "./upgradeBuilding";
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
});
