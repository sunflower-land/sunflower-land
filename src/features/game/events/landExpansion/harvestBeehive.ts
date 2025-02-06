import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import {
  DEFAULT_HONEY_PRODUCTION_TIME,
  updateBeehives,
} from "features/game/lib/updateBeehives";
import { getKeys } from "features/game/types/craftables";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { isWearableActive } from "features/game/lib/wearables";
import { produce } from "immer";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

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

const applySwarmBoostToCrops = (state: GameState): GameState["crops"] => {
  const { crops } = state;

  return getKeys(crops).reduce(
    (acc, cropId) => {
      const cropPlot = crops[cropId];

      if (cropPlot.crop) {
        const amount = cropPlot.crop.amount;

        return {
          ...acc,
          [cropId]: {
            ...cropPlot,
            crop: {
              ...cropPlot.crop,
              amount: calculateSwarmBoost(amount, state),
            },
          },
        };
      }

      return { ...acc, [cropId]: cropPlot };
    },
    {} as GameState["crops"],
  );
};

export const getHoneyMultiplier = (game: GameState) => {
  const { bumpkin } = game;

  let multiplier = 1;

  if (isWearableActive({ name: "Bee Suit", game })) {
    multiplier += 0.1;
  }

  if (isWearableActive({ name: "Honeycomb Shield", game })) {
    multiplier += 1;
  }

  if (bumpkin.skills["Sweet Bonus"]) {
    multiplier += 0.1;
  }

  if (isCollectibleBuilt({ name: "King of Bears", game })) {
    multiplier += 0.25;
  }

  return multiplier;
};

const getTotalHoneyProduced = (game: GameState, honeyProduced: number) => {
  return honeyProduced * getHoneyMultiplier(game);
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

    const totalHoneyProduced = getTotalHoneyProduced(stateCopy, honeyProduced);

    stateCopy.beehives[action.id].honey.produced = 0;
    stateCopy.beehives[action.id].honey.updatedAt = createdAt;
    stateCopy.inventory.Honey = (
      stateCopy.inventory.Honey ?? new Decimal(0)
    ).add(new Decimal(totalHoneyProduced));

    // If the beehive is full, check, apply and update swarm
    if (isFull) {
      if (stateCopy.beehives[action.id].swarm) {
        stateCopy.crops = applySwarmBoostToCrops(stateCopy);
      }

      // Actual value updated on the server
      stateCopy.beehives[action.id].swarm = false;
    }

    stateCopy.bumpkin.activity = trackActivity(
      `Honey Harvested`,
      stateCopy.bumpkin?.activity,
      new Decimal(totalHoneyProduced),
    );

    const updatedBeehives = updateBeehives({ game: stateCopy, createdAt });

    stateCopy.beehives = updatedBeehives;

    return stateCopy;
  });
}
