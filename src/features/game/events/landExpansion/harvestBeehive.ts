import Decimal from "decimal.js-light";
import { BoostName, GameState } from "features/game/types/game";
import {
  DEFAULT_HONEY_PRODUCTION_TIME,
  updateBeehives,
} from "features/game/lib/updateBeehives";
import { getKeys } from "features/game/types/craftables";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { isWearableActive } from "features/game/lib/wearables";
import { produce } from "immer";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export const HARVEST_BEEHIVE_ERRORS = {
  BEEHIVE_NOT_PLACED: "harvestBeeHive.notPlaced",
  NO_HONEY: "harvestBeeHive.noHoney",
};

export type HarvestBeehiveAction = {
  type: "beehive.harvested";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: HarvestBeehiveAction;
  createdAt?: number;
};

export const calculateSwarmBoost = (amount: number, game: GameState) => {
  const { bumpkin } = game;

  let boost = amount + 0.2;

  if (bumpkin.skills["Pollen Power Up"]) {
    boost += 0.1; // 0.3
  }

  return boost;
};

const applySwarmBoostToCrops = (
  state: GameState,
  createdAt: number,
): GameState["crops"] => {
  const { crops } = state;

  return getKeys(crops).reduce(
    (acc, cropId) => {
      const cropPlot = crops[cropId];
      const updatedPlot = { ...cropPlot };

      updatedPlot.beeSwarm = {
        count: (cropPlot.beeSwarm?.count ?? 0) + 1,
        swarmActivatedAt: createdAt,
      };

      return { ...acc, [cropId]: updatedPlot };
    },
    {} as GameState["crops"],
  );
};

export const getHoneyMultiplier = (game: GameState) => {
  const { bumpkin } = game;

  let multiplier = 1;
  const boostsUsed: BoostName[] = [];

  if (isWearableActive({ name: "Bee Suit", game })) {
    multiplier += 0.1;
    boostsUsed.push("Bee Suit");
  }

  if (isWearableActive({ name: "Honeycomb Shield", game })) {
    multiplier += 1;
    boostsUsed.push("Honeycomb Shield");
  }

  if (bumpkin.skills["Sweet Bonus"]) {
    multiplier += 0.1;
    boostsUsed.push("Sweet Bonus");
  }

  if (isCollectibleBuilt({ name: "King of Bears", game })) {
    multiplier += 0.25;
    boostsUsed.push("King of Bears");
  }

  return { multiplier, boostsUsed };
};

const getTotalHoneyProduced = (
  game: GameState,
  honeyProduced: number,
): { amount: number; boostsUsed: BoostName[] } => {
  const { multiplier, boostsUsed } = getHoneyMultiplier(game);

  return { amount: honeyProduced * multiplier, boostsUsed };
};

export function harvestBeehive({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!stateCopy.bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    // Update beehives before harvesting to set honey produced
    const freshBeehives = updateBeehives({ game: stateCopy, createdAt });

    stateCopy.beehives = freshBeehives;

    if (!stateCopy.beehives[action.id]) {
      throw new Error(HARVEST_BEEHIVE_ERRORS.BEEHIVE_NOT_PLACED);
    }

    if (stateCopy.beehives[action.id].honey.produced <= 0) {
      throw new Error(HARVEST_BEEHIVE_ERRORS.NO_HONEY);
    }

    const honeyProduced =
      stateCopy.beehives[action.id].honey.produced /
      DEFAULT_HONEY_PRODUCTION_TIME;
    const isFull = honeyProduced >= 1;

    const { amount: totalHoneyProduced, boostsUsed } = getTotalHoneyProduced(
      stateCopy,
      honeyProduced,
    );

    stateCopy.beehives[action.id].honey.produced = 0;
    stateCopy.beehives[action.id].honey.updatedAt = createdAt;
    stateCopy.inventory.Honey = (
      stateCopy.inventory.Honey ?? new Decimal(0)
    ).add(new Decimal(totalHoneyProduced));

    // If the beehive is full, check, apply and update swarm
    if (isFull) {
      if (stateCopy.beehives[action.id].swarm) {
        stateCopy.crops = applySwarmBoostToCrops(stateCopy, createdAt);
      }

      // Actual value updated on the server
      stateCopy.beehives[action.id].swarm = false;
    }

    stateCopy.boostsUsedAt = updateBoostUsed({
      game: stateCopy,
      boostNames: boostsUsed,
      createdAt,
    });

    stateCopy.farmActivity = trackFarmActivity(
      `Honey Harvested`,
      stateCopy.farmActivity,
      new Decimal(totalHoneyProduced),
    );

    const updatedBeehives = updateBeehives({ game: stateCopy, createdAt });

    stateCopy.beehives = updatedBeehives;

    return stateCopy;
  });
}
