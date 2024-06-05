import Decimal from "decimal.js-light";
import {
  AchievementName,
  ACHIEVEMENTS,
} from "features/game/types/achievements";
import { getKeys } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import cloneDeep from "lodash.clonedeep";
import { translate } from "lib/i18n/translate";

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

export function claimAchievement({ state, action }: Options): GameState {
  const stateCopy = clone(state);
  const bumpkin = stateCopy.bumpkin;
  const achievement = ACHIEVEMENTS()[action.achievement];

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin!");
  }

  if (bumpkin.achievements?.[action.achievement]) {
    throw new Error(translate("claimAchievement.alreadyHave"));
  }

  if (achievement.progress(stateCopy) < achievement.requirement) {
    throw new Error(translate("claimAchievement.requirementsNotMet"));
  }

  const bumpkinAchievements = bumpkin.achievements || {};

  bumpkin.achievements = { ...bumpkinAchievements, [action.achievement]: 1 };

  if (achievement.coins) {
    stateCopy.coins = stateCopy.coins + achievement.coins;
  }

  if (achievement.rewards) {
    getKeys(achievement.rewards).forEach((name) => {
      const previousAmount = stateCopy.inventory[name] || new Decimal(0);

      stateCopy.inventory[name] = previousAmount.add(
        achievement.rewards?.[name] || 0
      );
    });
  }

  // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?sjid=11955999175679069053-AP&client_type=gtag#unlock_achievement
  onboardingAnalytics.logEvent("unlock_achievement", {
    achievement_id: action.achievement,
  });

  return stateCopy;
}
