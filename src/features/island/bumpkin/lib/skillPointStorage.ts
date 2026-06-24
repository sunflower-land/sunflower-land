import { getAvailableBumpkinSkillPoints } from "features/game/events/landExpansion/choseSkill";
import type { GameState } from "features/game/types/game";

export function getAcknowledgedSkillPoints() {
  const value = localStorage.getItem("acknowledgedSkillPoints");

  if (!value) return {};

  return JSON.parse(value);
}

export function getAcknowledgedSkillPointsForBumpkin(id: number) {
  return getAcknowledgedSkillPoints()[id] ?? 0;
}

export function hasUnacknowledgedSkillPoints(game?: GameState) {
  const bumpkin = game?.bumpkin;
  if (!bumpkin) return false;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(game);
  const acknowledgedSkillPoints = getAcknowledgedSkillPointsForBumpkin(
    bumpkin.id,
  );

  return availableSkillPoints > Number(acknowledgedSkillPoints);
}

export function acknowledgeSkillPoints(game?: GameState) {
  const bumpkin = game?.bumpkin;
  if (!bumpkin) return;

  const availableSkillPoints = getAvailableBumpkinSkillPoints(game);
  const currentAcknowledgedSkillPoints = getAcknowledgedSkillPoints();

  const newValue = {
    ...currentAcknowledgedSkillPoints,
    [bumpkin.id]: availableSkillPoints,
  };

  return localStorage.setItem(
    "acknowledgedSkillPoints",
    JSON.stringify(newValue),
  );
}
