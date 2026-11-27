import { produce } from "immer";
import { refreshBeehivesOnRateChange } from "features/game/lib/updateBeehives";
import { Decimal } from "decimal.js-light";
import { getKeys, getObjectEntries } from "lib/object";
import type {
  GameState,
  InventoryItemName,
  PlacedItem,
} from "features/game/types/game";
import type { PlaceableLocation } from "features/game/types/collectibles";
import {
  getWeatherShop,
  type WeatherShopItem,
} from "features/game/types/calendar";
import { isWeatherProtectionCollectible } from "features/game/lib/weatherProtectionCollectibles";
import {
  getWeatherItemIngredients,
  isWeatherItemName,
  type WeatherItemName,
} from "features/game/types/weatherItems";
import { hasFeatureAccess } from "lib/flags";
import { getChestItemCount } from "features/island/hud/components/inventory/utils/inventory";
import { appendBoostHistory } from "features/game/lib/boostWindows";
import { refreshBasicScarecrowTimeAOE } from "features/game/lib/aoe";
import {
  getCoveredWindow,
  getWeatherEvents,
  isWeatherItemGreyed,
} from "features/game/lib/weatherItemCover";

export type RenewWeatherCollectibleAction = {
  type: "weatherCollectible.renewed";
  name: WeatherShopItem | WeatherItemName;
  location: PlaceableLocation;
  id: string;
  /** Weather items: the player's pick for a recipe with a choice. */
  ingredient?: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: RenewWeatherCollectibleAction;
  createdAt?: number;
};

/**
 * A weather item used on an event that has ended: pay the full recipe again
 * and it starts fresh, as if placed now.
 */
function renewWeatherItem(
  game: GameState,
  name: WeatherItemName,
  placement: PlacedItem,
  ingredient: InventoryItemName | undefined,
  createdAt: number,
) {
  if (
    !isWeatherItemGreyed({
      game,
      item: name,
      placement,
      events: getWeatherEvents(game),
      now: createdAt,
    })
  ) {
    throw new Error("Collectible is not used");
  }

  const ingredients = getWeatherItemIngredients(name, ingredient);
  if (!ingredients) {
    throw new Error("Invalid ingredient");
  }

  // Check everything before taking anything. Placed flowers don't count.
  getObjectEntries(ingredients).forEach(([item, amount]) => {
    if (getChestItemCount(game, item).lt(amount ?? 0)) {
      throw new Error(`Insufficient ingredient: ${item}`);
    }
  });

  getObjectEntries(ingredients).forEach(([item, amount]) => {
    game.inventory[item] = (game.inventory[item] ?? new Decimal(0)).sub(
      amount ?? 0,
    );
  });

  // Keep the time it covered the event it was used on (see
  // syncGuardianPlacements).
  const covered = getCoveredWindow({
    game,
    item: name,
    placement,
    from: placement.placedAt ?? 0,
    to: createdAt,
    events: getWeatherEvents(game),
  });
  if (covered) appendBoostHistory(game, name, covered, createdAt);

  placement.placedAt = createdAt;
  delete placement.usedUntil;
  delete placement.weatherCheckedUntil;
}

export function renewWeatherCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const gameAfter = produce(state, (game) => {
    const isWeatherItem = isWeatherItemName(action.name);

    if (isWeatherItem && !hasFeatureAccess(game, "WEATHER")) {
      throw new Error("Weather items are not available");
    }

    if (!isWeatherItem && !isWeatherProtectionCollectible(action.name)) {
      throw new Error("Not a weather protection collectible");
    }

    // With the Weather flag on, the Weather Shop items are decorations.
    if (!isWeatherItem && hasFeatureAccess(game, "WEATHER")) {
      throw new Error("This item no longer protects");
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

    const collectibleToRenew = collectibleGroup.find(
      (collectible) => collectible.id === action.id,
    );

    if (!collectibleToRenew) {
      throw new Error("Collectible does not exist");
    }

    if (!collectibleToRenew.coordinates) {
      throw new Error("Collectible is not placed");
    }

    if (isWeatherItemName(action.name)) {
      renewWeatherItem(
        game,
        action.name,
        collectibleToRenew,
        action.ingredient,
        createdAt,
      );
      // A renewed weather item covers its event again from now (a Shade
      // Cloth speeds crops up again): keep each cell's Basic Scarecrow
      // time-AOE in step, as placeCollectible does.
      refreshBasicScarecrowTimeAOE(game);
      return game;
    }

    if (!collectibleToRenew.used) {
      throw new Error("Collectible is not used");
    }

    // Renewal costs the base Weather Shop price (scaled by the player's current
    // island), matching renewPetShrine — craft-time discounts are intentionally
    // not applied.
    const shopItem = getWeatherShop(game.island.type)[action.name];
    const coinCost = shopItem.price;
    const requirements = shopItem.ingredients();

    if (game.coins < coinCost) {
      throw new Error("Insufficient Coins");
    }

    const subtractedInventory = getKeys(requirements).reduce(
      (inventory, ingredientName) => {
        const count = inventory[ingredientName] || new Decimal(0);
        const totalAmount = requirements[ingredientName] || new Decimal(0);

        if (count.lessThan(totalAmount)) {
          throw new Error(`Insufficient ingredient: ${ingredientName}`);
        }

        inventory[ingredientName] = count.sub(totalAmount);

        return inventory;
      },
      { ...game.inventory },
    );

    game.inventory = subtractedInventory;
    game.coins -= coinCost;

    // Clear the used flag to restore protection (the weather-item equivalent of
    // resetting a cooldown timestamp).
    delete collectibleToRenew.used;

    return game;
  });

  // A renewed Wildflower Lure starts covering Bee Migration: re-settle the
  // hives so honey already scheduled picks up the new rate.
  return refreshBeehivesOnRateChange({
    gameBefore: state as GameState,
    gameAfter,
    createdAt,
  });
}
