import { produce } from "immer";
import { GameState } from "features/game/types/game";
import Decimal from "decimal.js-light";
import {
  hasHitHelpLimit,
  isMonumentComplete,
} from "features/game/types/monuments";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";

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

    const isLastClutter =
      Object.values(clutters).filter((clutter) => clutter.type === type)
        .length === 1;

    let amount = 1;
    if (
      (type === "Weed" || type === "Dung") &&
      isLastClutter &&
      isMonumentComplete({
        game: visitorGame,
        monument: "Poseidon's Throne",
      }) &&
      isCollectibleBuilt({ name: "Poseidon's Throne", game: visitorGame })
    ) {
      amount += 1;
    }

    visitorGame.inventory[type] = (
      visitorState?.inventory[type] ?? new Decimal(0)
    ).plus(amount);

    delete clutters[action.id];
  });
}
