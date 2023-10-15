import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

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
    (b) => b.id === action.buildingId
  );

  if (!building) {
    throw new Error("Composter does not exist");
  }

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  const compost = building.producing;
  if (!compost) {
    throw new Error("Composter is not producing anything");
  }

  if (createdAt < compost.readyAt) {
    throw new Error("Compost is not ready");
  }

  delete building.producing;

  const compostCount = stateCopy.inventory[compost.name] || new Decimal(0);
  const bait = composterDetails[action.building].bait;

  const baitCount = stateCopy.inventory[bait] || new Decimal(0);

  bumpkin.activity = trackActivity(
    `${compost.name} Collected`,
    bumpkin.activity
  );

  stateCopy.inventory[compost.name] = compostCount.add(
    composterDetails[action.building].produceAmount
  );
  stateCopy.inventory[bait] = baitCount.add(1);

  return stateCopy;
}
