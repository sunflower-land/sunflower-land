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

/**
 * Returns the price of obsidian in sunstones.
 *
 * 3 Obsidian = 1 Sunstone
 * Price increases by 1 Obsidian every 3 exchanges
 */
export function getObsidianSunstonePrice({
  gameState,
}: {
  gameState: GameState;
}): number {
  const exchanged = gameState.farmActivity["Obsidian Exchanged"] ?? 0;

  return 3 + Math.floor(exchanged / 3);
}

export function exchangeObsidian({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const obsidianRequired = getObsidianSunstonePrice({
      gameState: state,
    });

    const obsidian = game.inventory.Obsidian ?? new Decimal(0);

    if (obsidian.lt(obsidianRequired)) {
      throw new Error("Not enough obsidian");
    }

    game.inventory.Obsidian = obsidian.sub(obsidianRequired);
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
