import { produce } from "immer";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";

export type CompleteCaveExpansionAction = {
  type: "cave.expansionCompleted";
};

type Options = {
  state: Readonly<GameState>;
  action: CompleteCaveExpansionAction;
  createdAt?: number;
};

export enum COMPLETE_CAVE_EXPANSION_ERRORS {
  NO_FEATURE_ACCESS = "The Cave is not available for this player",
  NO_CONSTRUCTION = "The Cave is not being expanded",
  NOT_READY = "The Cave expansion is still being built",
}

/**
 * Finish a built Cave expansion: the Cave reaches the new tier and gains that
 * tier's Myco-Composter (an empty machine, ready for its first batch).
 */
export function completeCaveExpansion({
  state,
  action: _action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    if (!hasFeatureAccess(game, "CAVE")) {
      throw new Error(COMPLETE_CAVE_EXPANSION_ERRORS.NO_FEATURE_ACCESS);
    }

    const cave = game.cave;
    const construction = cave?.construction;
    if (!cave || !construction) {
      throw new Error(COMPLETE_CAVE_EXPANSION_ERRORS.NO_CONSTRUCTION);
    }
    if (construction.readyAt > createdAt) {
      throw new Error(COMPLETE_CAVE_EXPANSION_ERRORS.NOT_READY);
    }

    cave.tier = construction.tier;
    cave.machines[String(construction.tier)] = {};
    delete cave.construction;
  });
}
