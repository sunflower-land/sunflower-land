import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { getKeys } from "lib/object";
import type { BoostName, GameState } from "features/game/types/game";
import { onboardingAnalytics } from "lib/onboardingAnalytics";

import {
  getExpansionRequirements,
  getLand,
  type Requirements,
} from "features/game/types/expansions";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { ISLAND_MAX_EXPANSION } from "features/game/expansion/lib/expansionRequirements";
import { produce } from "immer";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";
import { getExpansionCoinCostWithVip } from "features/game/lib/vipAccess";

export type ExpandLandAction = {
  type: "land.expanded";
  farmId: number;
};

type Options = {
  state: Readonly<GameState>;
  action: ExpandLandAction;
  createdAt?: number;
};

/**
 * Initiates a land expansion for the player's game state.
 *
 * @param createdAt - Timestamp when the expansion starts
 * @returns The updated game state
 * @throws When the island expansion cap is reached, no expansions remain available, land is missing, an expansion is already in progress, the bumpkin level is insufficient, coins are insufficient, or any required resource is insufficient
 */
export function expandLand({ state, createdAt = Date.now() }: Options) {
  return produce(state, (game) => {
    // At an island's expansion cap the player must upgrade to gain more land.
    // Legacy farms already beyond the cap may remain but cannot expand further.
    const maxExpansion = ISLAND_MAX_EXPANSION[game.island.type];
    if ((game.inventory["Basic Land"]?.toNumber() ?? 0) >= maxExpansion) {
      throw new Error("Upgrade your island to expand further");
    }

    const bumpkin = game.bumpkin;

    const { requirements, boostsUsed } = expansionRequirements({ game });
    if (!requirements) {
      throw new Error("No more land expansions available");
    }

    const land = getLand({ game });
    if (!land) {
      throw new Error("Land Does Not Exists");
    }

    if (game.expansionConstruction) {
      throw new Error("Player is expanding");
    }

    const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);
    if (bumpkinLevel < requirements.bumpkinLevel) {
      throw new Error("Insufficient Bumpkin Level");
    }

    const effectiveCoinCost = getExpansionCoinCostWithVip({
      coins: requirements.coins,
      game,
      now: createdAt,
    });
    if (game.coins < effectiveCoinCost) {
      throw new Error("Insufficient coins");
    }
    game.coins -= effectiveCoinCost;
    game.farmActivity = trackFarmActivity(
      "Coins Spent",
      game.farmActivity,
      new Decimal(effectiveCoinCost),
    );

    const inventory = getKeys(requirements.resources).reduce(
      (inventory, ingredientName) => {
        const count = game.inventory[ingredientName] || new Decimal(0);
        const totalAmount =
          requirements?.resources[ingredientName] || new Decimal(0);

        if (count.lessThan(totalAmount)) {
          throw new Error(`Insufficient ingredient: ${ingredientName}`);
        }

        return {
          ...inventory,
          [ingredientName]: count.sub(totalAmount),
        };
      },
      game.inventory,
    );

    game.expansionConstruction = {
      createdAt,
      readyAt: createdAt + requirements.seconds * 1000,
    };

    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#tutorial_complete
    if (game.inventory["Basic Land"]?.eq(3)) {
      onboardingAnalytics.logEvent("tutorial_complete");
    }

    //developers.google.com/analytics/devguides/collection/ga4/reference/events?sjid=11955999175679069053-AP&client_type=gtag#level_up
    onboardingAnalytics.logEvent("level_up", {
      level: game.inventory["Basic Land"]?.toNumber() ?? 3,
    });

    game.expandedAt = createdAt;

    game.inventory = inventory;

    game.boostsUsedAt = updateBoostUsed({
      game,
      boostNames: boostsUsed,
      createdAt,
    });

    return game;
  });
}

export const expansionRequirements = ({
  game,
}: {
  game: GameState;
}): {
  requirements: Requirements | undefined;
  boostsUsed: { name: BoostName; value: string }[];
} => {
  const level = (game.inventory["Basic Land"]?.toNumber() ?? 0) + 1;

  const boostsUsed: { name: BoostName; value: string }[] = [];

  const requirements = getExpansionRequirements({
    island: game.island.type,
    expansion: level,
    ascensionLevel: game.island.ascensionLevel,
  });

  if (!requirements) {
    return { requirements: undefined, boostsUsed };
  }

  let resources = requirements.resources;

  // Half resource costs
  if (isCollectibleBuilt({ name: "Grinx's Hammer", game })) {
    resources = getKeys(resources).reduce(
      (acc, key) => ({
        ...acc,
        [key]: key === "Gem" ? resources[key] : (resources[key] ?? 0) / 2,
      }),
      {},
    );
    boostsUsed.push({ name: "Grinx's Hammer", value: "x0.5" });
  }

  return { requirements: { ...requirements, resources }, boostsUsed };
};
