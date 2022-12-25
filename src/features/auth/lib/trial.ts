import { TRIAL_FARM } from "features/game/lib/constants";
import { makeGame } from "features/game/lib/transforms";
import { GameState } from "features/game/types/game";

const host = window.location.host.replace(/^www\./, "");
const TRIAL_FARM_LOCAL_STORAGE_KEY = `sb_wiz.zpc.trial.${host}-${window.location.pathname}`;

export function loadTrialFarm(): GameState {
  const game = localStorage.getItem(TRIAL_FARM_LOCAL_STORAGE_KEY);

  if (!game) {
    return TRIAL_FARM;
  }

  return makeGame(JSON.parse(game));
}

export function saveTrial(game: GameState) {
  localStorage.setItem(TRIAL_FARM_LOCAL_STORAGE_KEY, JSON.stringify(game));
}

export function hasTrialFarm() {
  return !!localStorage.getItem(TRIAL_FARM_LOCAL_STORAGE_KEY);
}
