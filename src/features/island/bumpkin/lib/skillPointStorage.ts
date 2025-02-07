export function getAcknowledgedSkillPoints() {
  const value = localStorage.getItem("acknowledgedSkillPoints");

  if (!value) return {};

  return JSON.parse(value);
}

export function getAcknowledgedSkillPointsForBumpkin(id: number) {
  return getAcknowledgedSkillPoints()[id] ?? 0;
}
