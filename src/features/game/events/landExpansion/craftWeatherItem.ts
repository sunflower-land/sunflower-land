import Decimal from "decimal.js-light";
import { produce } from "immer";
import { getObjectEntries } from "lib/object";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { getChestItemCount } from "features/island/hud/components/inventory/utils/inventory";
import {
  getWeatherItemIngredients,
  isWeatherItemName,
  type WeatherItemName,
} from "features/game/types/weatherItems";

export type CraftWeatherItemAction = {
  type: "weatherItem.crafted";
  item: WeatherItemName;
  /** The player's pick for a recipe with a choice (a beetle, a flower). */
  ingredient?: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: CraftWeatherItemAction;
  createdAt?: number;
};

export function craftWeatherItem({ state, action }: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "WEATHER")) {
      throw new Error("Weather items are not available");
    }

    if (!isWeatherItemName(action.item)) {
      throw new Error("Not a weather item");
    }

    // Inventory counts placed collectibles too.
    if ((game.inventory[action.item] ?? new Decimal(0)).gte(1)) {
      throw new Error("You already have this weather item");
    }

    const ingredients = getWeatherItemIngredients(
      action.item,
      action.ingredient,
    );

    if (!ingredients) {
      throw new Error("Invalid ingredient");
    }

    // Check everything before taking anything. Only unplaced items count:
    // flowers, for one, can be placed on the farm.
    getObjectEntries(ingredients).forEach(([name, amount]) => {
      if (getChestItemCount(game, name).lt(amount ?? 0)) {
        throw new Error(`Insufficient ingredient: ${name}`);
      }
    });

    getObjectEntries(ingredients).forEach(([name, amount]) => {
      game.inventory[name] = (game.inventory[name] ?? new Decimal(0)).sub(
        amount ?? 0,
      );
    });

    game.inventory[action.item] = new Decimal(1);

    game.farmActivity = trackFarmActivity(
      `${action.item} Crafted`,
      game.farmActivity,
    );
  });
}
