import { Equipped } from "features/game/types/bumpkin";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { assertEquipment } from "./equip";

export type EquipFarmHandAction = {
  type: "farmHand.equipped";
  id: string;
  equipment: Equipped;
};

type Options = {
  state: Readonly<GameState>;
  action: EquipFarmHandAction;
  createdAt?: number;
};

export function equipFarmhand({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);
  const bumpkin = game.farmHands.bumpkins[action.id];

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  assertEquipment({ game, equipment: action.equipment, bumpkin });

  bumpkin.equipped = action.equipment;

  return game;
}
