import { produce } from "immer";
import { GameState } from "features/game/types/game";
import Decimal from "decimal.js-light";

export type CollectGarbageAction = {
  type: "garbage.collected";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: CollectGarbageAction;
  createdAt?: number;
  visitorState?: GameState;
};

/**
 * Local only event to collect garbage
 */
export function collectGarbage({
  state,
  action,
  visitorState,
  createdAt = Date.now(),
}: Options): [GameState, GameState] {
  return produce([state, visitorState!], ([game, visitorGame]) => {
    console.log({ CleanGame: visitorGame });
    const clutters = game.socialFarming?.clutter?.locations;

    if (!clutters || !clutters[action.id]) {
      throw new Error("No clutter found");
    }

    const type = clutters[action.id].type;

    visitorGame.inventory[type] = (
      visitorState?.inventory[type] ?? new Decimal(0)
    ).plus(1);

    console.log("locally collected", type, visitorGame.inventory[type]);

    delete clutters[action.id];
  });
}
