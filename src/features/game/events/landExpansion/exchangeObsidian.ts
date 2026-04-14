import { GameState } from "../../types/game";

import { produce } from "immer";
import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";

export type ObsidianExchangedAction = {
  type: "obsidian.exchanged";
};

type Options = {
  state: Readonly<GameState>;
  action: ObsidianExchangedAction;
  createdAt?: number;
};

export const OBSIDIAN_PRICE = 3;

export function exchangeObsidian({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const obsidian = game.inventory.Obsidian ?? new Decimal(0);

    if (obsidian.lt(OBSIDIAN_PRICE)) {
      throw new Error("Not enough obsidian");
    }

    game.inventory.Obsidian = obsidian.sub(OBSIDIAN_PRICE);
    game.inventory.Sunstone = (game.inventory.Sunstone ?? new Decimal(0)).add(
      1,
    );

    game.farmActivity = trackFarmActivity(
      "Obsidian Exchanged",
      game.farmActivity,
    );

    return game;
  });
}
