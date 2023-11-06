import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { getSeasonalTicket } from "features/game/types/seasons";
import { trackActivity } from "features/game/types/bumpkinActivity";

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
    throw new Error("You do not have a Bumpkin");
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

  const currentScales =
    stateCopy.inventory[getSeasonalTicket()] || new Decimal(0);

  const currentTentaclesInInventory =
    stateCopy.inventory["Kraken Tentacle"] || new Decimal(0);

  const currentTentaclesPlaced =
    stateCopy.collectibles["Kraken Tentacle"]?.length || 0;

  // Only accept tentacles that are not placed (in collectibles)
  if (currentTentaclesInInventory.sub(currentTentaclesPlaced).lte(0)) {
    throw new Error("Insufficient quantity to trade");
  }

  // subtract kraken tentacle
  stateCopy.inventory["Kraken Tentacle"] = currentTentaclesInInventory.sub(1);

  // Add 10 scales per Tentacle
  stateCopy.inventory[getSeasonalTicket()] = currentScales.add(10);

  const bannerQty =
    stateCopy.collectibles["Catch the Kraken Banner"]?.length || 0;

  // Adds +2 bonus with banner
  if (bannerQty > 0) {
    stateCopy.inventory[getSeasonalTicket()] =
      stateCopy.inventory[getSeasonalTicket()]?.add(2);
  }
  // Add delivery count
  stateCopy.npcs.shelly.deliveryCount += 1;

  // Add activity
  bumpkin.activity = trackActivity("Kraken Tentacle Traded", bumpkin.activity);

  return stateCopy;
}
