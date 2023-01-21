import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { ResourceName } from "features/game/types/resources";
import cloneDeep from "lodash.clonedeep";
import { RESOURCE_FIELDS } from "./placeResource";

export type RemoveResourceAction = {
  type: "resource.removed";
  resource: ResourceName;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveResourceAction;
  createdAt?: number;
};

export function removeResource({ state, action }: Options) {
  const stateCopy = cloneDeep(state) as GameState;

  const { resources, inventory, bumpkin } = stateCopy;
  const resoureField = RESOURCE_FIELDS[action.resource];

  if (bumpkin === undefined) {
    throw new Error("TODO");
  }

  if (!resources[resoureField]) {
    throw new Error("Resource type does not exist");
  }

  const resource = resources[resoureField][action.id];

  if (!resource) {
    throw new Error("No resource found");
  }

  const shovelAmount = inventory["Rusty Shovel"] || new Decimal(0);

  if (shovelAmount.lessThan(1)) {
    throw new Error("No shovels");
  }

  delete stateCopy.resources[resoureField][action.id];

  console.log("Removeed", stateCopy.resources);
  // bumpkin.activity = trackActivity("Resource Removed", bumpkin.activity);

  inventory["Rusty Shovel"] = inventory["Rusty Shovel"]?.minus(1);

  return stateCopy;
}
