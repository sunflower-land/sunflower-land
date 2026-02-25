import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type RemoveFarmHandAction = {
  type: "farmHand.removed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RemoveFarmHandAction;
  createdAt?: number;
};

export function removeFarmHand({ state, action }: Options): GameState {
  return produce(state, (game) => {
    const farmHand = game.farmHands.bumpkins[action.id];

    if (!farmHand) {
      throw new Error("Farm hand does not exist");
    }

    // When coordinates/location are cleared the farm hand falls back
    // to the default strip outside the house.
    // TODO
  });
}
