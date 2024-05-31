import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";

export type TradeTentacleAction = {
  type: "shelly.tradeTentacle";
};

type Options = {
  state: Readonly<GameState>;
  action: TradeTentacleAction;
  createdAt?: number;
};

export function tradeTentacle({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin!");
  }

  if (!stateCopy.npcs) {
    throw new Error("NPCs does not exist");
  }

  // insuficient tentacles
  if (!stateCopy.inventory["Kraken Tentacle"]) {
    throw new Error("Insufficient quantity to trade");
  }

  if (!stateCopy.npcs?.shelly) {
    stateCopy.npcs.shelly = { deliveryCount: 0 };
  }

  if (!stateCopy.npcs?.shelly.deliveryCount) {
    stateCopy.npcs.shelly = { ...stateCopy.npcs?.shelly, deliveryCount: 0 };
  }

  const currentScales = stateCopy.inventory["Mermaid Scale"] || new Decimal(0);

  const currentTentaclesInInventory =
    stateCopy.inventory["Kraken Tentacle"] || new Decimal(0);

  const tentaclesInChest =
    getChestItems(stateCopy)["Kraken Tentacle"] || new Decimal(0);

  // Only accept tentacles that are not placed (in collectibles)
  if (tentaclesInChest.lte(0)) {
    throw new Error("Insufficient quantity to trade");
  }

  // subtract kraken tentacle
  stateCopy.inventory["Kraken Tentacle"] = currentTentaclesInInventory.sub(1);

  // Add 10 scales per Tentacle
  stateCopy.inventory["Mermaid Scale"] = currentScales.add(10);

  const bannerQty =
    stateCopy.inventory["Catch the Kraken Banner"] || new Decimal(0);

  // Adds +2 bonus with banner
  if (bannerQty.gte(1)) {
    stateCopy.inventory["Mermaid Scale"] =
      stateCopy.inventory["Mermaid Scale"]?.add(2);
  }
  // Add delivery count
  stateCopy.npcs.shelly.deliveryCount += 1;

  // Add activity
  bumpkin.activity = trackActivity("Kraken Tentacle Traded", bumpkin.activity);

  return stateCopy;
}
