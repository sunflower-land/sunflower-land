import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { Bumpkin, GameState, HayseedHank } from "features/game/types/game";

export const getProgress = (hayseedHank: HayseedHank, game: GameState) => {
  if (!hayseedHank.progress) return 0;

  const chore = hayseedHank.chore;
  if (chore.activity) {
    return (
      (game.bumpkin?.activity?.[chore.activity] ?? 0) -
      hayseedHank.progress.startCount
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

export const isTaskComplete = (hayseedHank: HayseedHank, game: GameState) => {
  return getProgress(hayseedHank, game) >= hayseedHank.chore.requirement;
};
