import Decimal from "decimal.js-light";
import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type ClaimAchievementAction = {
  type: "achievement.claimed";
  achievement: AchievementName;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimAchievementAction;
};

const clone = (state: GameState): GameState => {
  return cloneDeep(state);
};

export const getAttainableAchievementNames = (state: Readonly<GameState>) => {
  const achievements = ACHIEVEMENTS();
  const achievementKeys = getKeys(achievements);

  const attainableAchievementNames = achievementKeys.filter((name) => {
    const achievement = achievements[name];
    const progress = achievement.progress(state);
    const isComplete = progress >= achievement.requirement;
    return isComplete;
  });

  return attainableAchievementNames;
};

export const getUnclaimedAchievementNames = (state: Readonly<GameState>) => {
  const achievements = ACHIEVEMENTS();

  const bumpkinAchievements = state.bumpkin?.achievements || {};
  const achievementKeys = getKeys(achievements);

  const unclaimedAchievementNames = achievementKeys.filter((name) => {
    const achievement = achievements[name];
    const progress = achievement.progress(state);
    const isComplete = progress >= achievement.requirement;
    const isAlreadyClaimed = !!bumpkinAchievements[name];

    return isComplete && !isAlreadyClaimed;
  });

  return unclaimedAchievementNames;
};

export function claimAchievement({ state, action }: Options): GameState {
  const stateCopy = clone(state);
  const bumpkin = stateCopy.bumpkin;
  const achievement = ACHIEVEMENTS()[action.achievement];

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (bumpkin.achievements?.[action.achievement]) {
    throw new Error("You already have this achievement");
  }

  if (achievement.progress(stateCopy) < achievement.requirement) {
    throw new Error("You do not meet the requirements");
  }

  const bumpkinAchievments = bumpkin.achievements || {};

  bumpkin.achievements = { ...bumpkinAchievments, [action.achievement]: 1 };

  if (achievement.sfl) {
    stateCopy.balance = stateCopy.balance.add(achievement.sfl);
  }

  if (achievement.rewards) {
    getKeys(achievement.rewards).forEach((name) => {
      const previousAmount = stateCopy.inventory[name] || new Decimal(0);

      stateCopy.inventory[name] = previousAmount.add(
        achievement.rewards?.[name] || 0
      );
    });
  }

  return stateCopy;
}
