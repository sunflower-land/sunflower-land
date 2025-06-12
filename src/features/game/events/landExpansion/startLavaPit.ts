import { produce } from "immer";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import {
  GameState,
  Inventory,
  TemperateSeasonName,
} from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";

export const LAVA_PIT_REQUIREMENTS: Record<TemperateSeasonName, Inventory> = {
  autumn: {
    "Royal Ornament": new Decimal(1),
    Broccoli: new Decimal(1500),
  },
  winter: {
    Onion: new Decimal(1000),
    "Merino Wool": new Decimal(200),
  },
  spring: {
    Celestine: new Decimal(2),
    Duskberry: new Decimal(2),
    Lunara: new Decimal(2),
    Rhubarb: new Decimal(3000),
  },
  summer: {
    Oil: new Decimal(120),
    Pepper: new Decimal(1000),
  },
};

export type StartLavaPitAction = {
  type: "lavaPit.started";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: StartLavaPitAction;
  createdAt?: number;
};

export function startLavaPit({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (copy) => {
    const { inventory } = copy;

    const lavaPit = copy.lavaPits[action.id];

    if (!lavaPit) {
      throw new Error("Lava pit not found");
    }

    const requirements = hasFeatureAccess(state, "NEW_LAVA_PIT_REQUIREMENTS")
      ? LAVA_PIT_REQUIREMENTS[state.season.season]
      : {
          Oil: new Decimal(60),
          Cobia: new Decimal(5),
        };

    getKeys(requirements).forEach((item) => {
      const inventoryAmount = inventory[item] ?? new Decimal(0);
      const requiredAmount = requirements[item] ?? new Decimal(0);

      if (inventoryAmount.lt(requiredAmount)) {
        throw new Error(`Required resource ${item} not found`);
      }

      copy.inventory[item] = inventoryAmount.sub(requiredAmount);
    });

    if (lavaPit.startedAt !== undefined) {
      throw new Error("Lava pit already started");
    }

    lavaPit.startedAt = createdAt;
    lavaPit.collectedAt = undefined;

    return copy;
  });
}
