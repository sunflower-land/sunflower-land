import { produce } from "immer";
import { Decimal } from "decimal.js-light";
import { getKeys } from "lib/object";
import type { GameState } from "features/game/types/game";
import type { PlaceableLocation } from "features/game/types/collectibles";
import {
  getWeatherShop,
  type WeatherShopItem,
} from "features/game/types/calendar";
import { isWeatherProtectionCollectible } from "features/game/lib/weatherProtectionCollectibles";

export type RenewWeatherCollectibleAction = {
  type: "weatherCollectible.renewed";
  name: WeatherShopItem;
  location: PlaceableLocation;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RenewWeatherCollectibleAction;
  createdAt?: number;
};

export function renewWeatherCollectible({ state, action }: Options): GameState {
  return produce(state, (game) => {
    if (!isWeatherProtectionCollectible(action.name)) {
      throw new Error("Not a weather protection collectible");
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
}
