import Decimal from "decimal.js-light";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { GameState } from "features/game/types/game";
import { LandBiomeName, LAND_BIOMES } from "features/island/biomes/biomes";
import { produce } from "immer";
import { hasFeatureAccess } from "lib/flags";

export interface BuyBiomeAction {
  type: "biome.bought";
  biome: LandBiomeName;
}

type Options = {
  state: Readonly<GameState>;
  action: BuyBiomeAction;
  createdAt?: number;
};

export function buyBiome({ state, action, createdAt = Date.now() }: Options) {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "LANDSCAPING")) {
      throw new Error("This feature is not available");
    }

    const { biome } = action;

    const biomeData = LAND_BIOMES[biome];

    if (!biomeData) {
      throw new Error("This biome is not available");
    }
    const { limit = 0 } = biomeData;
    const biomeCount = game.inventory[biome] ?? new Decimal(0);

    if (biomeCount.gte(limit)) {
      throw new Error("You already have the maximum number of this biome");
    }

    const { ingredients, coins } = biomeData;
    const { balance } = game;
    const hasIngredients = getObjectEntries(ingredients).every(
      ([name, amount]) => {
        const inventoryAmount = game.inventory[name] ?? new Decimal(0);
        return inventoryAmount.gte(amount ?? new Decimal(0));
      },
    );

    if (!hasIngredients) {
      throw new Error("You don't have enough ingredients");
    }

    // Deduct ingredients
    getObjectEntries(ingredients).forEach(([name, amount]) => {
      game.inventory[name] = game.inventory[name]?.minus(
        amount ?? new Decimal(0),
      );
    });

    if (coins) {
      if (balance.lt(coins)) {
        throw new Error("You don't have enough coins");
      }
      game.balance = balance.minus(coins);
    }

    game.inventory[biome] = biomeCount.add(1);
    game.farmActivity = trackFarmActivity(`${biome} Bought`, game.farmActivity);
    return game;
  });
}
