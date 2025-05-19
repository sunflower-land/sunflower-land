import { produce } from "immer";
import { GameState } from "../../types/game";

export type MissFishAction = {
  type: "fish.missed";
  location?: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MissFishAction;
  createdAt?: number;
};

export function missFish({ state }: Options): GameState {
  return produce(state, (game) => {
    if (!game.fishing.wharf.castedAt) {
      throw new Error("Nothing has been casted");
    }

    delete game.fishing.wharf.castedAt;
    delete game.fishing.wharf.caught;
    delete game.fishing.wharf.chum;

    return {
      ...game,
    };
  });
}
