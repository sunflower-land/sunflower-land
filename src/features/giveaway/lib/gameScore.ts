import { SQUARE_WIDTH } from "features/game/lib/constants";
import type { MinigameType } from "./minigames";

/**
 * The live leaderboard ranks players by the position they broadcast to the MMO —
 * never the API. Each game maps a coordinate to a score (higher = better):
 *
 * - **race** — the X they've run (distance from the start line), in metres.
 * - **jump** — the height climbed (up = smaller Y), in metres.
 * - **chop / eggs / trivia / fishing** — the player's position isn't their
 *   score, so the scene broadcasts its points AS the Y coordinate (see each
 *   scene); the score is just that Y.
 *
 * Baselines match the giveaway spawns in `world/lib/spawn.ts`.
 */
const RACE_START_X = 32;
const JUMP_START_Y = 340;
const PIXELS_PER_METRE = SQUARE_WIDTH;

export function scoreFromPosition(
  minigame: MinigameType,
  x: number,
  y: number,
): number {
  switch (minigame) {
    case "race":
      return Math.max(0, Math.round((x - RACE_START_X) / PIXELS_PER_METRE));
    case "jump":
      return Math.max(0, Math.round((JUMP_START_Y - y) / PIXELS_PER_METRE));
    case "chop":
    case "eggs":
    case "trivia":
    case "fishing":
      return Math.max(0, Math.round(y));
    default:
      return 0;
  }
}

/** The unit suffix shown next to a score, per game (metres vs points). */
export function scoreUnit(minigame: MinigameType): string {
  return minigame === "race" || minigame === "jump" ? "m" : "";
}
