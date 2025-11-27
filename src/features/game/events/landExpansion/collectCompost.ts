import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";
import { ComposterName } from "features/game/types/composters";
import { getKeys } from "features/game/types/craftables";
import { CompostBuilding, GameState } from "features/game/types/game";
import { produce } from "immer";
import { translate } from "lib/i18n/translate";

export type collectCompostAction = {
  type: "compost.collected";
  building: ComposterName;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: collectCompostAction;
  createdAt?: number;
};

export function collectCompost({
  state,
  action,
  createdAt = Date.now(),
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

    getKeys(compost.items ?? {}).forEach((name) => {
      const previousCount = stateCopy.inventory[name] || new Decimal(0);
      stateCopy.inventory[name] = previousCount.add(compost.items[name] ?? 0);
    });

    stateCopy.farmActivity = trackFarmActivity(
      `${action.building} Collected`,
      stateCopy.farmActivity,
    );

    if (building.requires) {
      delete building.requires;
    }

    delete building.producing;

    delete building.boost;

    return stateCopy;
  });
}
