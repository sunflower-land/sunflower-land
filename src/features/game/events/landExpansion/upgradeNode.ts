import Decimal from "decimal.js-light";
import { produce } from "immer";
import { ADVANCED_RESOURCES, RockName } from "features/game/types/resources";
import { GameState, InventoryItemName, Rock } from "features/game/types/game";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { STONE_MULTIPLIERS } from "./placeStone";

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

export const hasPlacedStones = (
  game: GameState,
  upgradeTo: Exclude<RockName, "Stone Rock">,
) => {
  const advancedResource = ADVANCED_RESOURCES[upgradeTo];
  const preRequires = advancedResource.preRequires;

  const upgradeableStones = Object.entries(game.stones).filter(([_, stone]) => {
    return stone.tier ?? 1 === preRequires.tier;
  });

  return upgradeableStones.length >= preRequires.count;
};

export function upgradeStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const advancedResource = ADVANCED_RESOURCES[action.upgradeTo];

    if (!advancedResource) {
      throw new Error("Cannot upgrade node");
    }

    if ((game.coins ?? 0) < advancedResource.price) {
      throw new Error("Insufficient coins");
    }

    if (!hasPlacedStones(game, action.upgradeTo)) {
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

    // Remove the required number of stone rocks and
    // place the upgraded one at the first removed position
    let stonesToRemove = advancedResource.preRequires.count;
    let placement: { x: number; y: number } | undefined;

    Object.keys(game.stones).forEach((stoneId) => {
      if (stonesToRemove === 0) return;

      const rock = game.stones[stoneId];
      const tier = rock?.tier ?? 1;

      if (tier === advancedResource.preRequires.tier) {
        if (!placement && rock.x && rock.y) {
          placement = { x: rock.x, y: rock.y };
        }

        stonesToRemove--;
        delete game.stones[stoneId];
      }
    });

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
  });
}
