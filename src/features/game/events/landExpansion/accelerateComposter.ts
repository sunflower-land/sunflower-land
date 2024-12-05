import Decimal from "decimal.js-light";
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
  let { resourceBoostRequirements } = composterDetails[composter];

  if (gameState.bumpkin.skills["Composting Bonanza"]) {
    resourceBoostRequirements *= 2;
  }
  return { resourceBoostRequirements };
}

export function getSpeedUpTime({
  state,
  composter,
}: {
  state: GameState;
  composter: ComposterName;
}) {
  let { resourceBoostMilliseconds } = composterDetails[composter];

  if (state.bumpkin.skills["Composting Bonanza"]) {
    resourceBoostMilliseconds += 60 * 60 * 1000;
  }

  return { resourceBoostMilliseconds };
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

    const { resourceBoostMilliseconds } = getSpeedUpTime({
      state: stateCopy,
      composter: action.building,
    });
    const { resourceBoostRequirements } = getSpeedUpCost(
      stateCopy,
      action.building,
    );

    const boostResource = stateCopy.bumpkin.skills["Feathery Business"]
      ? "Feather"
      : "Egg";

    if (
      !(stateCopy.inventory[boostResource] ?? new Decimal(0)).gte(
        resourceBoostRequirements,
      )
    ) {
      throw new Error(`Missing ${boostResource}`);
    }

    // Subtract resources
    stateCopy.inventory[boostResource] = (
      stateCopy.inventory[boostResource] ?? new Decimal(0)
    ).sub(resourceBoostRequirements);

    // Subtract time
    producing.readyAt -= resourceBoostMilliseconds;

    composter.boost = {
      [boostResource]: resourceBoostRequirements,
    };

    return stateCopy;
  });
}
