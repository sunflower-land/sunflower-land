import Decimal from "decimal.js-light";
import { makeAnimalBuildingKey } from "features/game/lib/animals";
import { AnimalBuildingType } from "features/game/types/animals";
import { getKeys } from "features/game/types/decorations";
import { GameState, InventoryItemName } from "features/game/types/game";
import { produce } from "immer";

export type UpgradeBuildingAction = {
  type: "building.upgraded";
  buildingType: AnimalBuildingType;
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeBuildingAction;
  createdAt?: number;
};

export type AnimalBuildingLevel = 1 | 2 | 3;
type BuildingUpgradeCost = {
  coins: number;
  items: Partial<Record<InventoryItemName, Decimal>>;
};

export const BUILDING_UPGRADES: Record<
  AnimalBuildingType,
  Record<AnimalBuildingLevel, BuildingUpgradeCost>
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
};

export function upgradeBuilding({ state, action }: Options): GameState {
  return produce(state, (copy) => {
    const { buildings } = copy;

    if (!buildings[action.buildingType]) {
      throw new Error("Building not found");
    }

    const buildingKey = makeAnimalBuildingKey(action.buildingType);

    const building = copy[buildingKey];

    if (building.level >= 3) {
      throw new Error("Building is at max level");
    }

    const nextLevel = (building.level + 1) as Exclude<AnimalBuildingLevel, 1>;
    const upgradeCost = BUILDING_UPGRADES[action.buildingType][nextLevel];

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

    // Upgrade building level
    copy[buildingKey].level = nextLevel;

    return copy;
  });
}
