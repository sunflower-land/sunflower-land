import { GameState } from "../types/game";

export type DetectBotAction = {
  type: "bot.detected";
};

type Options = {
  state: Readonly<GameState>;
  action: DetectBotAction;
  createdAt?: number;
};

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `goblin.swarm.${host}-${window.location.pathname}`;

const SWARM_MINUTES = 5;

function setGoblinSwarm() {
  const swarmUntil = new Date(Date.now() + SWARM_MINUTES * 60 * 1000);
  localStorage.setItem(LOCAL_STORAGE_KEY, swarmUntil.toISOString());
}

export function getGoblinSwarm(): Date | null {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!storage) {
    return null;
  }

  return new Date(storage);
}

export function isSwarming() {
  const time = getGoblinSwarm();

  if (!time) {
    return false;
  }

  return Date.now() < time.getTime();
}

export function detectBot({ state, action, createdAt = Date.now() }: Options) {
  setGoblinSwarm();

  return state;
}
