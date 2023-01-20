import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";
import { getBumpkinLevel, SKILL_POINTS } from "features/game/lib/level";
import { GameState } from "features/game/types/game";

export function getAcknowledgedSkillPoints() {
  const value = localStorage.getItem("acknowledgedSkillPoints");

  if (!value) return {};

  return JSON.parse(value);
}

export function getAcknowledgedSkillPointsForBumpkin(id: number) {
  return getAcknowledgedSkillPoints()[id] ?? 0;
}

export function hasUnacknowledgedSkillPoints(state: Readonly<GameState>) {
  if (!state?.bumpkin) return false;

  const bumpkinLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);
  const totalSkillPoints = SKILL_POINTS[bumpkinLevel];
  const availableSkillPoints = getAvailableBumpkinSkillPoints(state.bumpkin);
  const acknowledgedSkillPoints = getAcknowledgedSkillPointsForBumpkin(
    state.bumpkin.id
  );

  return (
    availableSkillPoints > 0 &&
    totalSkillPoints > Number(acknowledgedSkillPoints)
  );
}

export function acknowledgeSkillPoints(state: Readonly<GameState>) {
  if (!state?.bumpkin) return;

  const bumpkinLevel = getBumpkinLevel(state.bumpkin?.experience ?? 0);
  const totalSkillPoints = SKILL_POINTS[bumpkinLevel];
  const currentAcknowledgedSkillPoints = getAcknowledgedSkillPoints();

  const newValue = {
    ...currentAcknowledgedSkillPoints,
    [state.bumpkin.id]: totalSkillPoints,
  };

  return localStorage.setItem(
    "acknowledgedSkillPoints",
    JSON.stringify(newValue)
  );
}
