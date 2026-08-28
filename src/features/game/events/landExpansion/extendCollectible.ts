import Decimal from "decimal.js-light";
import type { PlaceableLocation } from "features/game/types/collectibles";
import type { GameState } from "features/game/types/game";
import { produce } from "immer";
import { getKeys } from "lib/object";
import { hasFeatureAccess } from "lib/flags";
import { getChestItemCount } from "features/island/hud/components/inventory/utils/inventory";
import {
  getCollectibleExpiry,
  getExpiryCooldown,
} from "features/game/lib/collectibleBuilt";
import {
  getExtensionCost,
  isExtendableCollectible,
  type ExtendableCollectibleName,
} from "features/game/lib/collectibleExtension";

export type ExtendCollectibleAction = {
  type: "collectible.extended";
  name: ExtendableCollectibleName;
  location: PlaceableLocation;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ExtendCollectibleAction;
  createdAt?: number;
};

/**
 * Top up a STILL ACTIVE temporary collectible by paying its renewal cost again.
 * The bought time is banked on the placement as `extendedMs` rather than pushing
 * `createdAt` forward, so the boost keeps the time it has already served and its
 * window simply runs longer — extending is never a reset. Once a placement has
 * expired the existing renew flow takes over instead.
 */
export function extendCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "SPEED_BOOSTS")) {
      throw new Error("Collectible cannot be extended");
    }

    if (!isExtendableCollectible(action.name)) {
      throw new Error("Collectible cannot be extended");
    }

    const collectibleGroup =
      action.location === "home"
        ? game.home.collectibles[action.name]
        : action.location === "interior"
          ? game.interior.ground.collectibles[action.name]
          : action.location === "level_one"
            ? game.interior.level_one?.collectibles[action.name]
            : game.collectibles[action.name];

    if (!collectibleGroup) {
      throw new Error("Invalid collectible");
    }

    const collectibleToExtend = collectibleGroup.find(
      (collectible) => collectible.id === action.id,
    );

    if (!collectibleToExtend) {
      throw new Error("Collectible does not exist");
    }

    if (!collectibleToExtend.coordinates) {
      throw new Error("Collectible is not placed");
    }

    const expiresAt = getCollectibleExpiry({
      name: action.name,
      collectible: collectibleToExtend,
      game,
    });

    if (expiresAt <= createdAt) {
      throw new Error("Collectible has expired");
    }

    const { coins, ingredients } = getExtensionCost(action.name);

    if (game.coins < coins) {
      throw new Error("Insufficient Coins");
    }

    getKeys(ingredients).forEach((ingredientName) => {
      const required = ingredients[ingredientName] ?? new Decimal(0);
      // Chest count, not raw inventory: a placed collectible still counts towards
      // `inventory`, so charging the inventory alone would let the item being
      // extended pay for its own extension.
      const available = getChestItemCount(game, ingredientName);

      if (available.lt(required)) {
        throw new Error(`Insufficient ingredient: ${ingredientName}`);
      }

      game.inventory[ingredientName] = (
        game.inventory[ingredientName] ?? new Decimal(0)
      ).sub(required);
    });

    game.coins -= coins;

    collectibleToExtend.extendedMs =
      (collectibleToExtend.extendedMs ?? 0) +
      getExpiryCooldown(action.name, game);

    return game;
  });
}
