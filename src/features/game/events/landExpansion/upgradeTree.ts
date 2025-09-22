import Decimal from "decimal.js-light";

import { produce } from "immer";
import {
  ADVANCED_RESOURCES,
  TreeName,
  RESOURCE_MULTIPLIER,
} from "features/game/types/resources";
import { GameState, InventoryItemName, Tree } from "features/game/types/game";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  canUpgrade,
  getUpgradeableNodes,
} from "features/game/lib/resourceNodes";

export type UpgradeTreeAction = {
  type: "tree.upgraded";
  upgradeTo: Exclude<TreeName, "Tree">;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeTreeAction;
  createdAt?: number;
};

export function upgradeTree({
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
      throw new Error("Cannot upgrade tree");
    }

    if ((game.coins ?? 0) < advancedResource.price) {
      throw new Error("Insufficient coins");
    }

    if (!canUpgrade(game, action.upgradeTo)) {
      throw new Error("Not enough placed trees to upgrade");
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

    let treesToRemove = advancedResource.preRequires.count;
    let placement: { x: number; y: number } | undefined;

    const upgradeableTrees = getUpgradeableNodes(game, action.upgradeTo);

    for (let i = 0; i < upgradeableTrees.length && treesToRemove > 0; i++) {
      const [treeId, tree] = upgradeableTrees[i];
      const tier = "tier" in tree ? tree.tier : 1;

      if (tier === advancedResource.preRequires.tier) {
        if (!placement && tree.x && tree.y) {
          placement = { x: tree.x, y: tree.y };
        }

        treesToRemove--;
        delete game.trees[treeId];
      }
    }

    if (placement) {
      const newTree: Tree = {
        createdAt,
        wood: { choppedAt: 0 },
        x: placement.x,
        y: placement.y,
        tier: advancedResource.preRequires.tier === 1 ? 2 : 3,
        name: action.upgradeTo,
        multiplier: RESOURCE_MULTIPLIER[action.upgradeTo],
      };

      game.trees = {
        ...game.trees,
        [action.id]: newTree,
      };
    }

    game.farmActivity = trackFarmActivity(
      `${action.upgradeTo} Upgrade`,
      game.farmActivity,
    );
  });
}
