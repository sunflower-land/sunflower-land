import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import { CompostBuilding, GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { translate } from "lib/i18n/translate";

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
    throw new Error(translate("error.composterNotExist"));
  }

  const composter = buildings[0];
  const producing = composter.producing;

  if (!producing) {
    throw new Error(translate("error.composterNotProducing"));
  }

  if (createdAt > producing.readyAt) {
    throw new Error(translate("error.composterAlreadyDone"));
  }

  if (composter.boost) {
    throw new Error(translate("error.composterAlreadyBoosted"));
  }

  const details = composterDetails[action.building];
  if (!stateCopy.inventory.Egg?.gte(details.eggBoostRequirements)) {
    throw new Error(translate("error.missingEggs"));
  }

  // Subtract eggs
  stateCopy.inventory.Egg = stateCopy.inventory.Egg.sub(
    details.eggBoostRequirements,
  );

  // Subtract time
  producing.readyAt -= details.eggBoostMilliseconds;

  composter.boost = { Egg: details.eggBoostRequirements };

  return stateCopy;
}
