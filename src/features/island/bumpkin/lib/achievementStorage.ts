import {
  getAttainableAchievementNames,
  getUnclaimedAchievementNames,
} from "features/game/events/landExpansion/claimAchievement";
import { GameState } from "features/game/types/game";

export function getAcknowledgedAchievementsCount() {
  const value = localStorage.getItem("acknowledgedAchievementsCount");

  if (!value) return {};

  return JSON.parse(value);
}

export function getAcknowledgedAchievementsForBumpkin(id: number) {
  return getAcknowledgedAchievementsCount()[id] ?? 0;
}

export function hasUnacknowledgedAchievements(state: Readonly<GameState>) {
  if (!state?.bumpkin) return false;

  const attainableAchievements = getAttainableAchievementNames(state);
  const unclaimedAchievements = getUnclaimedAchievementNames(state);
  const acknowledgedAchievementsCount = getAcknowledgedAchievementsForBumpkin(
    state.bumpkin.id
  );

  return (
    unclaimedAchievements.length > 0 &&
    attainableAchievements.length > Number(acknowledgedAchievementsCount)
  );
}

export function acknowledgeAchievements(state: Readonly<GameState>) {
  if (!state?.bumpkin) return;

  const availableAchievements = getAttainableAchievementNames(state);
  const currentAcknowledgedAchievementsCount =
    getAcknowledgedAchievementsCount();

  const newValue = {
    ...currentAcknowledgedAchievementsCount,
    [state.bumpkin.id]: availableAchievements.length,
  };

  return localStorage.setItem(
    "acknowledgedAchievementsCount",
    JSON.stringify(newValue)
  );
}
