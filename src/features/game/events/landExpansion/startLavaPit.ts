import { produce } from "immer";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import {
  GameState,
  Inventory,
  TemperateSeasonName,
} from "features/game/types/game";

export const LAVA_PIT_REQUIREMENTS: Record<TemperateSeasonName, Inventory> = {
  autumn: {
    "Royal Ornament": new Decimal(1),
    Artichoke: new Decimal(30),
    Broccoli: new Decimal(750),
    Yam: new Decimal(1000),
  },
  winter: {
    "Merino Wool": new Decimal(200),
    Onion: new Decimal(400),
    Turnip: new Decimal(200),
  },
  spring: {
    Celestine: new Decimal(2),
    Lunara: new Decimal(2),
    Duskberry: new Decimal(2),
    Rhubarb: new Decimal(2000),
    Kale: new Decimal(100),
  },
  summer: {
    Oil: new Decimal(100),
    Pepper: new Decimal(750),
    Zucchini: new Decimal(1000),
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

    const requirements = LAVA_PIT_REQUIREMENTS[state.season.season];

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
