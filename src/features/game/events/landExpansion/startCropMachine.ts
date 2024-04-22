import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type StartCropMachineAction = {
  type: "cropMachine.started";
};

type Options = {
  state: Readonly<GameState>;
  action: StartCropMachineAction;
  createdAt?: number;
};

export function startCropMachine({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  if (!stateCopy.bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!stateCopy.buildings["Crop Machine"]) {
    throw new Error("Crop Machine does not exist");
  }

  const cropMachine = stateCopy.buildings["Crop Machine"][0];

  return stateCopy;
}
