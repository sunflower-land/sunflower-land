import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";
import { Bumpkin } from "features/game/types/game";

export function getAcknowledgedSkillPoints() {
  const value = localStorage.getItem("acknowledgedSkillPoints");

  if (!value) return {};

  return JSON.parse(value);
}

export function getAcknowledgedSkillPointsForBumpkin(id: number) {
  return getAcknowledgedSkillPoints()[id] ?? 0;
}

export function hasUnacknowledgedSkillPoints(bumpkin?: Bumpkin) {
  if (!bumpkin) return false;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
  const acknowledgedSkillPoints = getAcknowledgedSkillPointsForBumpkin(
    bumpkin.id
  );

  return availableSkillPoints > Number(acknowledgedSkillPoints);
}

export function acknowledgeSkillPoints(bumpkin?: Bumpkin) {
  if (!bumpkin) return;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);
  const currentAcknowledgedSkillPoints = getAcknowledgedSkillPoints();

  const newValue = {
    ...currentAcknowledgedSkillPoints,
    [bumpkin.id]: availableSkillPoints,
  };

  return localStorage.setItem(
    "acknowledgedSkillPoints",
    JSON.stringify(newValue)
  );
}
