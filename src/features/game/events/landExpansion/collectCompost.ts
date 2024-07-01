import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { ComposterName } from "features/game/types/composters";
import { getKeys } from "features/game/types/craftables";
import { CompostBuilding, GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
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
  const stateCopy = cloneDeep(state);
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
    throw new Error(translate("error.no.ready"));
    ("Compost is not ready");
  }

  getKeys(compost.items ?? {}).forEach((name) => {
    const previousCount = stateCopy.inventory[name] || new Decimal(0);
    stateCopy.inventory[name] = previousCount.add(compost.items[name] ?? 0);
  });

  bumpkin.activity = trackActivity(
    `${action.building} Collected`,
    bumpkin?.activity,
  );

  // Set on backend
  delete building.requires;

  delete building.producing;

  delete building.boost;

  return stateCopy;
}
