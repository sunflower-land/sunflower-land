import { Equipped } from "features/game/types/bumpkin";
import { GameState, Wardrobe } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type EquipBumpkinAction = {
  type: "bumpkin.equipped";
  equipment: Partial<Equipped>;
};

type Options = {
  state: Readonly<GameState>;
  action: EquipBumpkinAction;
  createdAt?: number;
};

export function equip({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { bumpkin } = stateCopy;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  // TODO - check if item available in wardrobe

  bumpkin.equipped = {
    ...bumpkin.equipped,
    ...action.equipment,
  };

  return stateCopy;
}
