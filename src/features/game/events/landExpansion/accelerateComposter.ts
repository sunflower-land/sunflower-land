import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import { CompostBuilding, GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type AccelerateComposterAction = {
  type: "compost.accelerated";
  building: ComposterName;
};

type Options = {
  state: Readonly<GameState>;
  action: AccelerateComposterAction;
  createdAt?: number;
};

export function accelerateComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  const buildings = stateCopy.buildings[action.building] as CompostBuilding[];
  if (!buildings) {
    throw new Error("Composter does not exist");
  }

  const composter = buildings[0];
  const producing = composter.producing;

  if (!producing) {
    throw new Error("Composter is not producing");
  }

  if (createdAt > producing.readyAt) {
    throw new Error("Composter already done");
  }

  if (composter.boost) {
    throw new Error("Already boosted");
  }

  const details = composterDetails[action.building];
  if (!stateCopy.inventory.Egg?.gte(details.eggBoostRequirements)) {
    throw new Error("Missing Eggs");
  }

  // Subtract eggs
  stateCopy.inventory.Egg = stateCopy.inventory.Egg.sub(
    details.eggBoostRequirements
  );

  // Subtract time
  producing.readyAt -= details.eggBoostMilliseconds;

  composter.boost = { Egg: details.eggBoostRequirements };

  return stateCopy;
}
