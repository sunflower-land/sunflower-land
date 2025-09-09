import Decimal from "decimal.js-light";

import { produce } from "immer";
import {
  ADVANCED_RESOURCES,
  RESOURCE_MULTIPLIER,
  RockName,
} from "features/game/types/resources";
import { GameState, InventoryItemName, Rock } from "features/game/types/game";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  canUpgrade,
  getUpgradeableNodes,
} from "features/game/lib/resourceNodes";

export type UpgradeRockAction = {
  type: "rock.upgraded";
  upgradeTo: Exclude<
    RockName,
    | "Stone Rock"
    | "Gold Rock"
    | "Iron Rock"
    | "Sunstone Rock"
    | "Crimstone Rock"
  >;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeRockAction;
  createdAt?: number;
};

export function upgradeRock({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { bumpkin } = game;

    if (!bumpkin) {
      throw new Error("Bumpkin not found");
    }

    const advancedResource = ADVANCED_RESOURCES[action.upgradeTo];

    if (!advancedResource) {
      throw new Error("Cannot upgrade node");
    }

    if ((game.coins ?? 0) < advancedResource.price) {
      throw new Error("Insufficient coins");
    }

    if (!canUpgrade(game, action.upgradeTo)) {
      throw new Error("Not enough placed stones to upgrade");
    }

    const ingredients = advancedResource.ingredients(bumpkin.skills);
    getObjectEntries(ingredients).forEach(([item, amount]) => {
      const required = new Decimal(amount ?? 0);
      if (required.lte(0)) return;

      const playerHas =
        game.inventory[item as InventoryItemName] ?? new Decimal(0);
      if (playerHas.lt(required)) {
        throw new Error(`Insufficient ${item}`);
      }
    });

    game.coins = (game.coins ?? 0) - advancedResource.price;

    // Remove the ingredients from inventory
    getObjectEntries(ingredients).forEach(([item, amount]) => {
      const required = new Decimal(amount ?? 0);
      if (required.lte(0)) return;

      const current =
        game.inventory[item as InventoryItemName] ?? new Decimal(0);
      game.inventory[item as InventoryItemName] = current.minus(required);
    });

    // Add the upgraded node to inventory
    const current = game.inventory[action.upgradeTo] ?? new Decimal(0);
    game.inventory[action.upgradeTo] = current.add(1);

    let rocksToRemove = advancedResource.preRequires.count;
    let placement: { x: number; y: number } | undefined;

    const upgradeableRocks = getUpgradeableNodes(game, action.upgradeTo);

    const rockStateKeyAccessor = STATE_ACCESSOR_KEYS[action.upgradeTo];
    for (let i = 0; i < upgradeableRocks.length && rocksToRemove > 0; i++) {
      const [rockId, rock] = upgradeableRocks[i];
      const tier = "tier" in rock ? rock.tier : 1;

      if (tier === advancedResource.preRequires.tier) {
        if (!placement && rock.x && rock.y) {
          placement = { x: rock.x, y: rock.y };
        }

        rocksToRemove--;
        delete game[rockStateKeyAccessor][rockId];
      }
    }

    if (placement) {
      const newRock: Rock = {
        createdAt,
        stone: { minedAt: 0 },
        x: placement.x,
        y: placement.y,
        tier: advancedResource.preRequires.tier === 1 ? 2 : 3,
        name: action.upgradeTo,
        multiplier: RESOURCE_MULTIPLIER[action.upgradeTo],
      };

      game[rockStateKeyAccessor] = {
        ...game[rockStateKeyAccessor],
        [action.id]: newRock,
      };
    }

    game.farmActivity = trackFarmActivity(
      `${action.upgradeTo} Upgrade`,
      game.farmActivity,
    );
  });
}

const STATE_ACCESSOR_KEYS: Record<
  UpgradeRockAction["upgradeTo"],
  "stones" | "iron" | "gold"
> = {
  "Fused Stone Rock": "stones",
  "Reinforced Stone Rock": "stones",
  "Refined Iron Rock": "iron",
  "Tempered Iron Rock": "iron",
  "Pure Gold Rock": "gold",
  "Prime Gold Rock": "gold",
};
