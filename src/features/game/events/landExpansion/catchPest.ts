import Decimal from "decimal.js-light";
import { Pest } from "features/game/types/clutter";
import { GameState } from "features/game/types/game";
import { enableMapSet, produce } from "immer";

export type CatchPestAction = {
  type: "pest.caught";
  id: string;
  pestName: Pest;
  visitedFarmId: number;
};

type Options = {
  state: Readonly<GameState>;
  action: CatchPestAction;
  createdAt?: number;
  visitorState?: GameState;
};

export function catchPest({
  state,
  action,
  visitorState,
}: Options): [GameState, GameState] {
  enableMapSet();
  return produce([state, visitorState!], ([game, visitorGame]) => {
    const { id, pestName, visitedFarmId } = action;

    if (
      !visitorGame.inventory["Pest Net"] ||
      visitorGame.inventory["Pest Net"].lt(1)
    ) {
      throw new Error("No Pest Net in inventory");
    }

    if (game.socialFarming?.caughtPests?.[visitedFarmId]?.includes(id)) {
      throw new Error("Pest already caught");
    }

    let caughtPests = game.socialFarming?.caughtPests;
    if (!caughtPests) {
      caughtPests = {};
    }

    if (!caughtPests[action.visitedFarmId]) {
      caughtPests[action.visitedFarmId] = [];
    }

    visitorGame.inventory["Pest Net"] =
      visitorGame.inventory["Pest Net"].sub(1);

    delete game.socialFarming?.clutter?.locations[id];

    caughtPests[action.visitedFarmId].push(action.id);
    game.socialFarming.caughtPests = caughtPests;

    visitorGame.inventory[pestName] = (
      visitorGame.inventory[pestName] ?? new Decimal(0)
    ).plus(1);
  });
}
