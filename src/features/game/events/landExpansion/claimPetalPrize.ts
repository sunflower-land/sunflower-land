import Decimal from "decimal.js-light";
import { BONUSES, BonusName } from "features/game/types/bonuses";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { produce } from "immer";

export type ClaimPetalPrizeAction = {
  type: "petalPuzzle.solved";
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimPetalPrizeAction;
  createdAt?: number;
};

export function hasClaimedPetalPrize({
  state,
  createdAt = Date.now(),
}: {
  state: GameState;
  createdAt: number;
}): boolean {
  const solvedAt = state.floatingIsland.petalPuzzleSolvedAt ?? 0;

  if (!solvedAt) {
    return false;
  }

  const todayKey = new Date(createdAt).toISOString().split("T")[0];
  const solvedAtKey = new Date(solvedAt).toISOString().split("T")[0];

  return solvedAtKey === todayKey;
}

export function claimPetalPrize({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    // Has already claimed?
    if (hasClaimedPetalPrize({ state: game, createdAt })) {
      throw new Error("Petal Prize already claimed today");
    }

    game.floatingIsland.petalPuzzleSolvedAt = createdAt;

    const previous = game.inventory["Bronze Love Box"] ?? new Decimal(0);
    game.inventory["Bronze Love Box"] = previous.add(1);

    return game;
  });
}
