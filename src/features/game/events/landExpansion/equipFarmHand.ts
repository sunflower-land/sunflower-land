import { assertEquipment } from "./equip";
import { Equipped } from "features/game/types/bumpkin";
import { GameState } from "features/game/types/game";
import { populateSaltFarm } from "features/game/types/salt";
import { produce } from "immer";

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
  return produce(state, (game) => {
    const bumpkin = game.farmHands.bumpkins[action.id];

    if (bumpkin === undefined) {
      throw new Error("Farm hand does not exist");
    }

    assertEquipment({
      equipment: action.equipment,
      bumpkin,
      game,
    });

    // Populate the salt farm with the new salt charges
    populateSaltFarm({ game, now: createdAt });

    bumpkin.equipped = action.equipment;

    return game;
  });
}
