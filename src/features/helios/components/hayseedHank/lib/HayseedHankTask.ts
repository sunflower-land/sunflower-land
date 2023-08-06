import { getBumpkinLevel } from "features/game/lib/level";
import { GameState } from "features/game/types/game";

export const getProgress = (game: GameState) => {
  if (!game.hayseedHank?.progress) return 0;

  const chore = game.hayseedHank.chore;
  if (chore.activity) {
    return (
      (game.bumpkin?.activity?.[chore.activity] ?? 0) -
      game.hayseedHank.progress.startCount
    );
  }

  if (chore.sfl) {
    return game.balance.toNumber();
  }

  if (chore.bumpkinLevel) {
    return getBumpkinLevel(game.bumpkin?.experience ?? 0);
  }

  if (chore.expansionCount) {
    return game.inventory["Basic Land"]?.toNumber() ?? 3 - 3;
  }

  return 0;
};

export const isTaskComplete = (game: GameState) => {
  return (
    getProgress(game) >=
    (game.hayseedHank?.chore.requirement ?? Number.MAX_SAFE_INTEGER)
  );
};
