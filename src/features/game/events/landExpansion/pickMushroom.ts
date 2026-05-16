import Decimal from "decimal.js-light";
import { BoostName, GameState } from "../../types/game";
import { produce } from "immer";
import { MushroomName } from "../../types/resources";
import { isCollectibleBuilt } from "../../lib/collectibleBuilt";
import { isWearableActive } from "../../lib/wearables";
import { getBudYieldBoosts } from "../../lib/getBudYieldBoosts";

/**
 * Returns the base yield amount for a mushroom type, along with the list
 * of boosts that contributed to it.
 *
 * Note: on the server the boosts are applied at spawn time and stored in
 * `mushroom.amount`. This helper lets clients reproduce the calculation
 * (e.g. to display a boost breakdown) without coupling to server internals.
 */
export function getMushroomYield({
  game,
  name,
}: {
  game: GameState;
  name: MushroomName;
}): {
  amount: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  let amount = 1;
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (name === "Wild Mushroom") {
    if (isCollectibleBuilt({ name: "Mushroom House", game })) {
      amount += 0.2;
      boostsUsed.push({ name: "Mushroom House", value: "+0.2" });
    }

    if (isCollectibleBuilt({ name: "Fairy Circle", game })) {
      amount += 0.2;
      boostsUsed.push({ name: "Fairy Circle", value: "+0.2" });
    }

    if (isWearableActive({ game, name: "Mushroom Hat" })) {
      amount += 0.1;
      boostsUsed.push({ name: "Mushroom Hat", value: "+0.1" });
    }
  }

  if (game.buds) {
    const { yieldBoost, budUsed } = getBudYieldBoosts(game.buds, name);
    if (yieldBoost > 0 && budUsed) {
      amount += yieldBoost;
      boostsUsed.push({ name: budUsed, value: `+${yieldBoost}` });
    }
  }

  return { amount, boostsUsed };
}

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

    const inventoryMushrooms = copy.inventory[mushroom.name] ?? new Decimal(0);
    copy.inventory[mushroom.name] = inventoryMushrooms.add(mushroom.amount);

    return copy;
  });
}
