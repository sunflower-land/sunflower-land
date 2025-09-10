import Decimal from "decimal.js-light";

import { produce } from "immer";
import { ADVANCED_RESOURCES, RockName } from "features/game/types/resources";
import { GameState, InventoryItemName, Rock } from "features/game/types/game";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { STONE_MULTIPLIERS } from "./placeStone";
import { canMine } from "./stoneMine";
import { trackFarmActivity } from "features/game/types/farmActivity";

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

export const canUpgrade = (
  game: GameState,
  upgradeTo: Exclude<RockName, "Stone Rock">,
) => {
  const advancedResource = ADVANCED_RESOURCES[upgradeTo];
  const preRequires = advancedResource.preRequires;

  const upgradeableStones = Object.entries(game.stones).filter(([_, stone]) => {
    const tier = stone?.tier ?? 1;
    if (canMine(stone)) {
      return tier === preRequires.tier;
    }

    return false;
  });

  return upgradeableStones.length >= preRequires.count;
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

    const ingredients = advancedResource.ingredients();
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

    let stonesToRemove = advancedResource.preRequires.count;
    let placement: { x: number; y: number } | undefined;

    // Sort stone IDs to ensure consistent deletion order with the backend
    const sortedStones = Object.keys(game.stones).sort();

    for (let i = 0; i < sortedStones.length && stonesToRemove > 0; i++) {
      const stoneId = sortedStones[i];
      const rock = game.stones[stoneId];
      const tier = rock?.tier ?? 1;

      if (tier === advancedResource.preRequires.tier) {
        if (!placement && rock.x && rock.y) {
          placement = { x: rock.x, y: rock.y };
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
        multiplier: STONE_MULTIPLIERS[action.upgradeTo],
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
