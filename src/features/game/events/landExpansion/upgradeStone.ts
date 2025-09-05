import Decimal from "decimal.js-light";

import { produce } from "immer";
import {
  ADVANCED_RESOURCES,
  RockName,
  RESOURCE_MULTIPLIER,
} from "features/game/types/resources";
import { GameState, InventoryItemName, Rock } from "features/game/types/game";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  canUpgrade,
  getUpgradeableNodes,
} from "features/game/lib/resourceNodes";

export type UpgradeStoneAction = {
  type: "stone.upgraded";
  upgradeTo: Exclude<RockName, "Stone Rock">;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeStoneAction;
  createdAt?: number;
};

export function upgradeStone({
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

    getObjectEntries(advancedResource.ingredients).forEach(([item, amount]) => {
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
    getObjectEntries(advancedResource.ingredients).forEach(([item, amount]) => {
      const required = new Decimal(amount ?? 0);
      if (required.lte(0)) return;

      const current =
        game.inventory[item as InventoryItemName] ?? new Decimal(0);
      game.inventory[item as InventoryItemName] = current.minus(required);
    });

    // Add the upgraded node to inventory
    const current = game.inventory[action.upgradeTo] ?? new Decimal(0);
    game.inventory[action.upgradeTo] = current.add(1);

    let stonesToRemove = advancedResource.preRequires.count;
    let placement: { x: number; y: number } | undefined;

    const upgradeableStones = getUpgradeableNodes(game, action.upgradeTo);

    for (let i = 0; i < upgradeableStones.length && stonesToRemove > 0; i++) {
      const [stoneId, stone] = upgradeableStones[i];
      const tier = "tier" in stone ? stone.tier : 1;

      if (tier === advancedResource.preRequires.tier) {
        if (!placement && stone.x && stone.y) {
          placement = { x: stone.x, y: stone.y };
        }

        stonesToRemove--;
        delete game.stones[stoneId];
      }
    }

    if (placement) {
      const newStone: Rock = {
        createdAt,
        stone: { minedAt: 0 },
        x: placement.x,
        y: placement.y,
        tier: advancedResource.preRequires.tier === 1 ? 2 : 3,
        name: action.upgradeTo,
        multiplier: RESOURCE_MULTIPLIER[action.upgradeTo],
      };

      game.stones = {
        ...game.stones,
        [action.id]: newStone,
      };
    }

    game.farmActivity = trackFarmActivity(
      `${action.upgradeTo} Upgrade`,
      game.farmActivity,
    );
  });
}
