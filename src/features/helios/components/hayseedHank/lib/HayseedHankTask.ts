import { Bumpkin, HayseedHank } from "features/game/types/game";

export const getProgress = (hayseedHank: HayseedHank, bumpkin: Bumpkin) => {
  if (!hayseedHank.progress) return 0;

  return (
    (bumpkin.activity?.[hayseedHank.chore.activity] ?? 0) -
    hayseedHank.progress.startCount
  );
};

export const isTaskComplete = (hayseedHank: HayseedHank, bumpkin: Bumpkin) => {
  return getProgress(hayseedHank, bumpkin) >= hayseedHank.chore.requirement;
};
