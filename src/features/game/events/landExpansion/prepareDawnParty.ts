import cloneDeep from "lodash.clonedeep";

import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { getKeys } from "features/game/types/craftables";

export type PreparePartyAction = {
  type: "dawnParty.prepared";
};

type Options = {
  state: Readonly<GameState>;
  action: PreparePartyAction;
  createdAt?: number;
};

export const PARTY_COOLDOWN = 12 * 60 * 60 * 1000;
// export const PARTY_COOLDOWN = 3 * 1000;

export function prepareParty({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);

  if (!game.dawnBreaker) {
    throw new Error("Not initialised");
  }

  const fulfilledAt = game.dawnBreaker?.party?.fulfilledAt ?? 0;
  console.log({ fulfilledAt });
  if (createdAt < fulfilledAt + PARTY_COOLDOWN) {
    throw new Error("Resources recently collected");
  }

  const fulfilledCount = game.dawnBreaker?.party?.fulfilledCount ?? 0;

  if (!game.dawnBreaker.party.requirements) {
    throw new Error("No more resources required");
  }
  const requirements = game.dawnBreaker.party.requirements;

  getKeys(requirements).forEach((ingredientName) => {
    const count = game.inventory[ingredientName] || new Decimal(0);
    const required = requirements[ingredientName] || 0;
    if (count.lt(required)) {
      throw new Error(`Insufficient ingredient: ${ingredientName}`);
    }

    game.inventory[ingredientName] = count.sub(required);
  });

  game.dawnBreaker.party = {
    fulfilledAt: createdAt,
    fulfilledCount: fulfilledCount + 1,
    requirements: game.dawnBreaker.party.requirements,
  };

  return game;
}
