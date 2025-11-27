import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { AnimalBuildingType } from "features/game/types/animals";
import { BuildingName } from "features/game/types/buildings";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getKeys } from "features/game/types/decorations";
import {
  GameState,
  InventoryItemName,
  UpgradableBuildingKey,
} from "features/game/types/game";
import { produce } from "immer";

export type UpgradeBuildingAction = {
  type: "building.upgraded";
  buildingType: UpgradableBuildingType;
};
export type UpgradableBuildingType = Extract<
  BuildingName,
  AnimalBuildingType | "Water Well"
>;

type Options = {
  state: Readonly<GameState>;
  action: UpgradeBuildingAction;
  createdAt?: number;
};

export type BuildingUpgradeCost = {
  coins: number;
  items: Partial<Record<InventoryItemName, Decimal>>;
  requiredLevel?: number;
  upgradeTime?: number;
};

export const isBuildingUpgradable = (
  name: BuildingName,
): name is UpgradableBuildingType => name in BUILDING_UPGRADES;

export const BUILDING_UPGRADES: Record<
  UpgradableBuildingType,
  Record<number, BuildingUpgradeCost>
> = {
  "Hen House": {
    // Level 1 is the default and does not require any upgrades
    1: {
      coins: 0,
      items: {},
    },
    2: {
      coins: 7500,
      items: {
        Wood: new Decimal(500),
        Iron: new Decimal(50),
        Gold: new Decimal(40),
        Crimstone: new Decimal(10),
      },
    },
    3: {
      coins: 50000,
      items: {
        Wood: new Decimal(2500),
        Iron: new Decimal(150),
        Gold: new Decimal(100),
        Crimstone: new Decimal(50),
        Oil: new Decimal(100),
      },
    },
  },
  Barn: {
    1: {
      coins: 0,
      items: {},
    },
    2: {
      coins: 10000,
      items: {
        Wood: new Decimal(1000),
        Iron: new Decimal(100),
        Gold: new Decimal(75),
        Crimstone: new Decimal(30),
      },
    },
    3: {
      coins: 75000,
      items: {
        Wood: new Decimal(5000),
        Iron: new Decimal(300),
        Gold: new Decimal(200),
        Crimstone: new Decimal(125),
        Oil: new Decimal(250),
      },
    },
  },
  "Water Well": {
    1: {
      coins: 0,
      items: {},
      requiredLevel: 2,
    },
    2: {
      coins: 200,
      items: { Wood: new Decimal(5), Stone: new Decimal(2) },
      requiredLevel: 4,
      upgradeTime: 60 * 60 * 1000,
    },
    3: {
      coins: 400,
      items: { Wood: new Decimal(5), Stone: new Decimal(5) },
      requiredLevel: 11,
      upgradeTime: 60 * 60 * 2 * 1000,
    },
    4: {
      coins: 800,
      items: { Wood: new Decimal(10), Stone: new Decimal(10) },
      requiredLevel: 15,
      upgradeTime: 60 * 60 * 4 * 1000,
    },
  },
};

export const makeUpgradableBuildingKey = (
  buildingName: Extract<BuildingName, "Hen House" | "Barn" | "Water Well">,
): UpgradableBuildingKey => {
  return buildingName
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "") as UpgradableBuildingKey;
};

export function upgradeBuilding({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { buildings, bumpkin } = copy;
    const { experience } = bumpkin;
    const { buildingType } = action;

    if (!buildings[buildingType]) {
      throw new Error("Building not found");
    }

    const buildingKey = makeUpgradableBuildingKey(buildingType);

    const building = copy[buildingKey];

    const upgrades = BUILDING_UPGRADES[buildingType];

    if (building.level >= getKeys(upgrades).length) {
      throw new Error("Building is at max level");
    }
    if (building.upgradeReadyAt && building.upgradeReadyAt > createdAt) {
      throw new Error("Building is still under upgrade");
    }

    const currentExperienceLevel = getBumpkinLevel(experience);

    const nextLevel = building.level + 1;
    const upgradeCost = upgrades[nextLevel];

    if (
      upgradeCost.requiredLevel &&
      currentExperienceLevel < upgradeCost.requiredLevel
    ) {
      throw new Error("Insufficient level for upgrade");
    }

    if (state.coins < upgradeCost.coins) {
      throw new Error("Insufficient coins for upgrade");
    }

    const items = getKeys(upgradeCost.items);

    items.forEach((itemName) => {
      const requiredAmount = upgradeCost.items[itemName] ?? new Decimal(0);
      const playerAmount = copy.inventory[itemName] || new Decimal(0);

      if (playerAmount.lt(requiredAmount)) {
        throw new Error(`Insufficient ${itemName} for upgrade`);
      }

      copy.inventory[itemName] = playerAmount.minus(requiredAmount);
    });

    // Deduct coins
    copy.coins -= upgradeCost.coins;
    copy.farmActivity = trackFarmActivity(
      "Coins Spent",
      copy.farmActivity,
      new Decimal(upgradeCost.coins),
    );

    // Upgrade building level
    copy[buildingKey].level = nextLevel;

    // Set readyAt
    if (upgradeCost.upgradeTime) {
      copy[buildingKey].upgradeReadyAt = createdAt + upgradeCost.upgradeTime;
      copy[buildingKey].upgradedAt = createdAt;
    }

    return copy;
  });
}
