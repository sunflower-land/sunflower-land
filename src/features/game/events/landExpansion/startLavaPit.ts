import { produce } from "immer";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { GameState, Inventory } from "features/game/types/game";

export const LAVA_PIT_REQUIREMENTS: Inventory = {
  Crimstone: new Decimal(10),
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

    getKeys(LAVA_PIT_REQUIREMENTS).forEach((item) => {
      const inventoryAmount = inventory[item] ?? new Decimal(0);
      const requiredAmount = LAVA_PIT_REQUIREMENTS[item] ?? new Decimal(0);

      if (inventoryAmount.lt(requiredAmount)) {
        throw new Error(`Required resource ${item} not found`);
      }

      copy.inventory[item] = inventoryAmount.sub(requiredAmount);
    });

    if (lavaPit.startedAt !== undefined) {
      throw new Error("Lava pit already started");
    }

    lavaPit.startedAt = createdAt;

    return copy;
  });
}
