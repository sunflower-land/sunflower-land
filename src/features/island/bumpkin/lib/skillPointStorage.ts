import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/pickSkill";
import { Bumpkin } from "features/game/types/game";

export function getAcknowledgedSkillPoints() {
  return localStorage.getItem("acknowledgedSkillPoints");
}

export function hasUnacknowledgedSkillPoints(bumpkin?: Bumpkin) {
  if (!bumpkin) return false;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);

  const acknowledgedSkillPoints = getAcknowledgedSkillPoints() ?? 0;

  return availableSkillPoints > Number(acknowledgedSkillPoints);
}

export function acknowledgeSkillPoints(bumpkin?: Bumpkin) {
  if (!bumpkin) return;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(bumpkin);

  return localStorage.setItem(
    "acknowledgedSkillPoints",
    `${availableSkillPoints}`
  );
}
