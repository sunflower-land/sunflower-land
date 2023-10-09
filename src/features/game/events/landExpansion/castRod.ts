import cloneDeep from "lodash.clonedeep";

import { GameState, InventoryItemName } from "../../types/game";
import { CHUM_AMOUNTS, FishingBait } from "features/game/types/fishing";
import Decimal from "decimal.js-light";

export type CastRodAction = {
  type: "rod.casted";
  bait: FishingBait;
  chum?: InventoryItemName;
};

type Options = {
  state: Readonly<GameState>;
  action: CastRodAction;
  createdAt?: number;
};

export function castRod({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  console.log({ game });
  const rodCount = game.inventory.Rod ?? new Decimal(0);
  // Requires Rod
  if (rodCount.lt(1)) {
    throw new Error("Missing rod");
  }

  // Requires Bait
  if (!game.inventory[action.bait]?.gte(1)) {
    throw new Error(`Missing ${action.bait}`);
  }

  if (game.fishing.wharf.castedAt) {
    throw new Error("Already casted");
  }

  // Subtract Chum
  if (action.chum) {
    const chumAmount = CHUM_AMOUNTS[action.chum] ?? 0;
    if (!chumAmount) {
      throw new Error(`${action.chum} is not a supported chum`);
    }

    const inventoryChum = game.inventory[action.chum] ?? new Decimal(0);

    if (inventoryChum.lt(chumAmount)) {
      throw new Error(`Insufficent Chum: ${action.chum}`);
    }

    game.inventory[action.chum] = inventoryChum.sub(chumAmount);
  }

  // Subtracts Rod
  game.inventory.Rod = rodCount.sub(1);

  // Casts Rod
  game.fishing = {
    wharf: {
      castedAt: createdAt,
      chum: action.chum,
    },
  };

  return {
    ...game,
  };
}
