import { useSyncExternalStore } from "react";
import { LOVE_BUTTONS_COUNT } from "./loveIsland";

/**
 * What the Love Buttons HUD shows, pushed from the Phaser scene. The scene
 * is the one place that knows the round (from the room, or its local
 * stand-in), so it publishes the counts here and the React HUD at the top
 * of the screen subscribes - re-rendering only when a count changes, never
 * on the room's 20/s patches.
 */
export type LoveButtonsHudState = {
  /** Shown only while the Love Island scene is running the puzzle. */
  visible: boolean;
  /** Buttons with someone on them. */
  pressed: number;
  total: number;
  /** Players standing on a button - more than `pressed` when some share one. */
  standing: number;
  /** Whether the local player is on a button right now. */
  standingOnOne: boolean;
  solved: boolean;
};

const HIDDEN: LoveButtonsHudState = {
  visible: false,
  pressed: 0,
  total: LOVE_BUTTONS_COUNT,
  standing: 0,
  standingOnOne: false,
  solved: false,
};

let state: LoveButtonsHudState = HIDDEN;
const listeners = new Set<() => void>();

function isSame(a: LoveButtonsHudState, b: LoveButtonsHudState): boolean {
  return (
    a.visible === b.visible &&
    a.pressed === b.pressed &&
    a.total === b.total &&
    a.standing === b.standing &&
    a.standingOnOne === b.standingOnOne &&
    a.solved === b.solved
  );
}

export function setLoveButtonsHud(next: Omit<LoveButtonsHudState, "visible">) {
  const value = { ...next, visible: true };
  if (isSame(state, value)) return;

  state = value;
  listeners.forEach((listener) => listener());
}

/** Take the HUD down - the scene has stopped running the puzzle. */
export function hideLoveButtonsHud() {
  if (!state.visible) return;

  state = HIDDEN;
  listeners.forEach((listener) => listener());
}

export function getLoveButtonsHud(): LoveButtonsHudState {
  return state;
}

export function subscribeLoveButtonsHud(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useLoveButtonsHud(): LoveButtonsHudState {
  return useSyncExternalStore(subscribeLoveButtonsHud, getLoveButtonsHud);
}
