import type { MinigameType } from "./minigames";

/**
 * The live leaderboard ranks players by the `points` each mini-game submits to
 * the MMO in real time (see each scene's `sendPoints`). This just formats the
 * unit shown next to a score — metres for the distance games, plain points for
 * the rest.
 */
export function scoreUnit(minigame: MinigameType): string {
  return minigame === "race" || minigame === "jump" ? "m" : "";
}
