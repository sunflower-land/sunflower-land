import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import { CompostBuilding, GameState } from "features/game/types/game";
import { produce } from "immer";
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

export function getSpeedUpCost(gameState: GameState, composter: ComposterName) {
  let { eggBoostRequirements } = composterDetails[composter];

  if (gameState.bumpkin.skills["Composting Bonanza"]) {
    eggBoostRequirements *= 0.5;
  }
  return { eggBoostRequirements };
}

export function accelerateComposter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const buildings = stateCopy.buildings[action.building] as CompostBuilding[];
    if (!buildings) {
      throw new Error(translate("error.composterNotExist"));
    }

    const composter = buildings[0];
    const { producing } = composter;

    if (!producing) {
      throw new Error(translate("error.composterNotProducing"));
    }

    if (createdAt > producing.readyAt) {
      throw new Error(translate("error.composterAlreadyDone"));
    }

    if (composter.boost) {
      throw new Error(translate("error.composterAlreadyBoosted"));
    }

    const { eggBoostMilliseconds } = composterDetails[action.building];
    const { eggBoostRequirements } = getSpeedUpCost(stateCopy, action.building);
    if (!stateCopy.inventory.Egg?.gte(eggBoostRequirements)) {
      throw new Error(translate("error.missingEggs"));
    }

    // Subtract eggs
    stateCopy.inventory.Egg = stateCopy.inventory.Egg.sub(eggBoostRequirements);

    // Subtract time
    producing.readyAt -= eggBoostMilliseconds;

    composter.boost = { Egg: eggBoostRequirements };

    return stateCopy;
  });
}
