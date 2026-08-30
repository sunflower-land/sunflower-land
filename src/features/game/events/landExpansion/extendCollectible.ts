import Decimal from "decimal.js-light";
import type { PlaceableLocation } from "features/game/types/collectibles";
import type { GameState, PlacedItem } from "features/game/types/game";
import { produce } from "immer";
import { getKeys } from "lib/object";
import { hasFeatureAccess } from "lib/flags";
import { getChestItemCount } from "features/island/hud/components/inventory/utils/inventory";
import {
  getCollectibleExpiry,
  getExpiryCooldown,
  isTemporaryCollectible,
  type TemporaryCollectibleName,
} from "features/game/lib/collectibleBuilt";
import {
  getExtensionCost,
  getExtensionPayments,
  getExtensionResult,
} from "features/game/lib/collectibleExtension";
import { appendBoostHistory } from "features/game/lib/boostWindows";
import { refreshBasicScarecrowTimeAOE } from "features/game/lib/aoe";

export type ExtendCollectibleAction = {
  type: "collectible.extended";
  name: TemporaryCollectibleName;
  location: PlaceableLocation;
  id: string;
  /**
   * What to spend. Defaults to the collectible itself; a totem may also be paid
   * for with the other totem, since the two grant the same buff.
   */
  payWith?: TemporaryCollectibleName;
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
 *
 * Paying for one totem with the other buys THAT totem's duration, and leaves the
 * longer-lasting of the two on the map: a Super Totem spent on a Time Warp Totem
 * promotes the placement, absorbing the Time Warp Totem's remaining time.
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

    if (!isTemporaryCollectible(action.name)) {
      throw new Error("Collectible cannot be extended");
    }

    const payWith = action.payWith ?? action.name;

    if (
      payWith !== action.name &&
      !getExtensionPayments(action.name).includes(payWith)
    ) {
      throw new Error(`Cannot extend ${action.name} with ${payWith}`);
    }

    const getGroup = (name: TemporaryCollectibleName) =>
      action.location === "home"
        ? game.home.collectibles[name]
        : action.location === "interior"
          ? game.interior.ground.collectibles[name]
          : action.location === "level_one"
            ? game.interior.level_one?.collectibles[name]
            : game.collectibles[name];

    const setGroup = (
      name: TemporaryCollectibleName,
      items: PlacedItem[] | undefined,
    ) => {
      const collectibles =
        action.location === "home"
          ? game.home.collectibles
          : action.location === "interior"
            ? game.interior.ground.collectibles
            : action.location === "level_one"
              ? game.interior.level_one?.collectibles
              : game.collectibles;

      if (!collectibles) return;

      if (items === undefined) {
        delete collectibles[name];
        return;
      }

      collectibles[name] = items;
    };

    const collectibleGroup = getGroup(action.name);

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

    const { coins, ingredients } = getExtensionCost(action.name, payWith);

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
    });

    const result = getExtensionResult(action.name, payWith, game);
    const isPromotion = result !== action.name;

    if (isPromotion) {
      // The paid totem BECOMES the placement, so it is not spent - the totem it
      // replaces is the one consumed. Either way an extension costs one item.
      game.inventory[action.name] = (
        game.inventory[action.name] ?? new Decimal(0)
      ).sub(1);
    } else {
      getKeys(ingredients).forEach((ingredientName) => {
        game.inventory[ingredientName] = (
          game.inventory[ingredientName] ?? new Decimal(0)
        ).sub(ingredients[ingredientName] ?? new Decimal(0));
      });
    }

    game.coins -= coins;

    /**
     * `extendedMs` is an offset on top of `createdAt + cooldown`, and a promotion
     * changes which cooldown that is (4h -> 7d). Rebasing against the NEW base
     * keeps the placement's expiry at exactly `oldExpiry + addedMs` instead of
     * silently re-timing it. With no promotion this is the plain
     * `extendedMs + addedMs`.
     */
    const addedMs = getExpiryCooldown(payWith, game);
    const extendedMs = Math.max(
      0,
      getExpiryCooldown(action.name, game) +
        (collectibleToExtend.extendedMs ?? 0) +
        addedMs -
        getExpiryCooldown(result, game),
    );

    if (!isPromotion) {
      collectibleToExtend.extendedMs = extendedMs;

      // The longer window can pull windowed crops' derived readyAt earlier, so
      // any Basic Scarecrow AOE timestamps need to be re-synced.
      refreshBasicScarecrowTimeAOE(game);

      return game;
    }

    // Preserve the window the replaced totem had already earned before its record
    // is renamed. A no-op while the totems merge into one window, but it keeps the
    // contribution correct if they are ever separated.
    appendBoostHistory(
      game,
      action.name,
      { from: collectibleToExtend.createdAt ?? 0, to: expiresAt },
      createdAt,
    );

    const remaining = collectibleGroup.filter(
      (collectible) => collectible.id !== action.id,
    );
    setGroup(action.name, remaining.length > 0 ? remaining : undefined);
    setGroup(result, [
      ...(getGroup(result) ?? []),
      { ...collectibleToExtend, extendedMs },
    ]);

    // The longer window can pull windowed crops' derived readyAt earlier, so
    // any Basic Scarecrow AOE timestamps need to be re-synced.
    refreshBasicScarecrowTimeAOE(game);

    return game;
  });
}
