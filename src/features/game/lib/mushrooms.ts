import Decimal from "decimal.js-light";
import type { BoostName, GameState } from "features/game/types/game";
import type { MushroomName } from "features/game/types/resources";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { getBudYieldBoosts } from "features/game/lib/getBudYieldBoosts";

/**
 * How many mushrooms one pick yields, with its boosts. Shared by island
 * mushrooms and Cave Mushroom tiles. Decimal, so stacked boosts stay exact.
 */
export function getMushroomYield({
  name,
  game,
}: {
  name: MushroomName;
  game: GameState;
}): { amount: number; boostsUsed: { name: BoostName; value: string }[] } {
  let amount = new Decimal(1);
  const boostsUsed: { name: BoostName; value: string }[] = [];

  if (name === "Wild Mushroom") {
    if (isCollectibleBuilt({ name: "Mushroom House", game })) {
      amount = amount.add(0.2);
      boostsUsed.push({ name: "Mushroom House", value: "+0.2" });
    }

    if (isCollectibleBuilt({ name: "Fairy Circle", game })) {
      amount = amount.add(0.2);
      boostsUsed.push({ name: "Fairy Circle", value: "+0.2" });
    }

    if (isWearableActive({ name: "Mushroom Hat", game })) {
      amount = amount.add(0.1);
      boostsUsed.push({ name: "Mushroom Hat", value: "+0.1" });
    }
  }

  const { yieldBoost, budUsed } = getBudYieldBoosts(game.buds ?? {}, name);
  amount = amount.add(yieldBoost);
  if (budUsed) boostsUsed.push({ name: budUsed, value: `+${yieldBoost}` });

  return { amount: amount.toNumber(), boostsUsed };
}
