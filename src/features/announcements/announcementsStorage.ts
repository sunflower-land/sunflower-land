import { getSeasonalBanner } from "features/game/types/seasons";

export function getGameRulesLastRead(): Date | null {
  const value = localStorage.getItem("gameRulesLastRead");
  if (!value) return null;

  return new Date(value);
}

export function acknowledgeGameRules() {
  return localStorage.setItem("gameRulesLastRead", new Date().toISOString());
}

export function getCodeOfConductLastRead(): Date | null {
  const value = localStorage.getItem("codeOfConductLastRead");
  if (!value) return null;

  return new Date(value);
}

export function acknowledgeCodeOfConduct() {
  return localStorage.setItem(
    "codeOfConductLastRead",
    new Date().toISOString()
  );
}

export function getIntroductionRead(): Date | null {
  const value = localStorage.getItem("islesIntroduction");
  if (!value) return null;

  return new Date(value);
}

export function acknowledgeIntroduction() {
  return localStorage.setItem("islesIntroduction", new Date().toISOString());
}

export function getSeasonPassRead(): Date | null {
  const value = localStorage.getItem(`${getSeasonalBanner()}Read`);
  if (!value) return null;

  return new Date(value);
}

export function acknowledgeSeasonPass() {
  return localStorage.setItem(
    `${getSeasonalBanner()}Read`,
    new Date().toISOString()
  );
}

export function getBudsRead(): Date | null {
  const value = localStorage.getItem("budsDrop");
  if (!value) return null;

  return new Date(value);
}

export function acknowledgeBuds() {
  return localStorage.setItem("budsDrop", new Date().toISOString());
}
