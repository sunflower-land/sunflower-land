import { produce } from "immer";
import { GameState } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { hasHitHelpLimit } from "features/game/types/monuments";

export type CollectGarbageAction = {
  type: "garbage.collected";
  id: string;
  totalHelpedToday: number;
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
    const clutters = game.socialFarming?.clutter?.locations;

    if (!clutters || !clutters[action.id]) {
      throw new Error("No clutter found");
    }

    // If over help limit, throw error
    if (
      hasHitHelpLimit({
        game: visitorGame,
        totalHelpedToday: action.totalHelpedToday,
      })
    ) {
      throw new Error("Help limit reached");
    }

    const type = clutters[action.id].type;

    visitorGame.inventory[type] = (
      visitorState?.inventory[type] ?? new Decimal(0)
    ).plus(1);

    delete clutters[action.id];
  });
}
