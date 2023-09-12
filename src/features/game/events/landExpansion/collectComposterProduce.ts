import Decimal from "decimal.js-light";
import { BuildingName } from "features/game/types/buildings";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type collectComposterProduceAction = {
  type: "composterProduce.collected";
  building: BuildingName;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: collectComposterProduceAction;
  createdAt?: number;
};

export function collectComposterProduce({
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

  const produce = building.producing;
  if (!produce) {
    throw new Error("Composter is not producing anything");
  }

  if (createdAt < produce.readyAt) {
    throw new Error("Produce is not ready");
  }

  delete building.producing;

  const consumableCount = stateCopy.inventory[produce.name] || new Decimal(0);

  bumpkin.activity = trackActivity(
    `${produce.name} Collected`,
    bumpkin.activity
  );

  stateCopy.inventory[produce.name] = consumableCount.add(1);

  return stateCopy;
}
