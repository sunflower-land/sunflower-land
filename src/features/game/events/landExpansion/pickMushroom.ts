import Decimal from "decimal.js-light";
import type { GameState } from "../../types/game";
import { produce } from "immer";
import { getMushroomYield } from "features/game/lib/mushrooms";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type PickMushroomAction = {
  type: "mushroom.picked";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: PickMushroomAction;
  createdAt?: number;
};

export function pickMushroom({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (copy) => {
    const mushrooms = copy.mushrooms?.mushrooms;

    if (!mushrooms) {
      throw new Error("Mushrooms not populated");
    }

    const mushroom = mushrooms[action.id];
    if (!mushroom) {
      throw new Error(`Mushroom not found: ${action.id}`);
    }

    delete mushrooms[action.id];

    // Yield is worked out at pick time, so boosts placed after the mushroom
    // spawned still count (and removed ones no longer do).
    const { amount, boostsUsed } = getMushroomYield({
      name: mushroom.name,
      game: copy,
    });
    copy.boostsUsedAt = updateBoostUsed({
      game: copy,
      boostNames: boostsUsed,
      createdAt,
    });

    const inventoryMushrooms = copy.inventory[mushroom.name] ?? new Decimal(0);
    copy.inventory[mushroom.name] = inventoryMushrooms.add(amount);

    return copy;
  });
}
