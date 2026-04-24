import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import { getKeys } from "lib/object";
import { CompostBuilding, GameState } from "features/game/types/game";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";
import { rollWormAmount } from "./composterBait";
import { updateBoostUsed } from "features/game/types/updateBoostUsed";

export type collectCompostAction = {
  type: "compost.collected";
  building: ComposterName;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: collectCompostAction;
  createdAt?: number;
  farmId?: number;
};

export function collectCompost({
  state,
  action,
  createdAt = Date.now(),
  farmId = 0,
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { bumpkin } = stateCopy;

    const building = stateCopy.buildings[action.building]?.find(
      (b) => b.id === action.buildingId,
    ) as CompostBuilding;

    if (!building) {
      throw new Error(translate("error.composterNotExist"));
    }

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const compost = building.producing;
    if (!compost) {
      throw new Error(translate("error.noprod.composter"));
    }

    if (createdAt < compost.readyAt) {
      throw new Error("Compost is not ready");
    }

    const { worm } = composterDetails[action.building];
    const counter = stateCopy.farmActivity[`${worm} Collected`] ?? 0;
    const { worms, boostsUsed: wormBoostsUsed } = rollWormAmount({
      state: stateCopy,
      building: action.building,
      farmId,
      counter,
    });

    getKeys(compost.items ?? {}).forEach((name) => {
      // Legacy composters started before roll-on-collect was introduced
      // still store a pre-rolled worm amount here; ignore it so the new
      // seeded roll below is the single source of truth.
      if (name === worm) return;
      const previousCount = stateCopy.inventory[name] || new Decimal(0);
      stateCopy.inventory[name] = previousCount.add(compost.items[name] ?? 0);
    });

    if (worms > 0) {
      const previousWorms = stateCopy.inventory[worm] || new Decimal(0);
      stateCopy.inventory[worm] = previousWorms.add(worms);
    }

    stateCopy.farmActivity = trackFarmActivity(
      `${action.building} Collected`,
      stateCopy.farmActivity,
    );
    stateCopy.farmActivity = trackFarmActivity(
      `${worm} Collected`,
      stateCopy.farmActivity,
    );

    if (wormBoostsUsed.length > 0) {
      stateCopy.boostsUsedAt = updateBoostUsed({
        game: stateCopy,
        boostNames: wormBoostsUsed,
        createdAt,
      });
    }

    if (building.requires) {
      delete building.requires;
    }

    delete building.producing;

    delete building.boost;

    return stateCopy;
  });
}
