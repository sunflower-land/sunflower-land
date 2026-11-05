import type { GameState } from "features/game/types/game";
import { isCavePatchCleared } from "features/game/types/caveRecipes";
import { canRestartCaveBatch } from "features/game/types/cavePatch";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";

/**
 * The Cave tutorial: Gloomwick walks a new Cave owner through their first
 * batch, one step at a time. Each step opens with him saying what to do (once),
 * then his speech bubble sums the step up and a hand points at the thing to
 * touch. Frontend only: the step is derived from the Cave's state, and only
 * which popups were closed (and the final barrier tap) live in localStorage.
 */
export type CaveTutorialStep =
  | "start-batch"
  | "wait"
  | "dig"
  | "buy-shovels"
  | "clue"
  | "expand";

/** Which step popups were closed, plus `done` once the barrier was tapped. */
export type CaveTutorialSeen = Partial<
  Record<CaveTutorialStep | "done", boolean>
>;

const ACKNOWLEDGEMENTS = {
  "start-batch": "Cave Tutorial Start Batch",
  wait: "Cave Tutorial Wait",
  dig: "Cave Tutorial Dig",
  "buy-shovels": "Cave Tutorial Buy Shovels",
  clue: "Cave Tutorial Clue",
  expand: "Cave Tutorial Expand",
  done: "Cave Tutorial Done",
} as const;

export type CaveTutorialAcknowledgement =
  (typeof ACKNOWLEDGEMENTS)[keyof typeof ACKNOWLEDGEMENTS];

export const getCaveTutorialSeen = (): CaveTutorialSeen => ({
  "start-batch": hasShownTutorial(ACKNOWLEDGEMENTS["start-batch"]),
  wait: hasShownTutorial(ACKNOWLEDGEMENTS.wait),
  dig: hasShownTutorial(ACKNOWLEDGEMENTS.dig),
  "buy-shovels": hasShownTutorial(ACKNOWLEDGEMENTS["buy-shovels"]),
  clue: hasShownTutorial(ACKNOWLEDGEMENTS.clue),
  expand: hasShownTutorial(ACKNOWLEDGEMENTS.expand),
  done: hasShownTutorial(ACKNOWLEDGEMENTS.done),
});

export const acknowledgeCaveTutorial = (key: keyof CaveTutorialSeen) =>
  acknowledgeTutorial(ACKNOWLEDGEMENTS[key]);

/** Digging takes a Sand Shovel, or a Sand Drill for a 2x2 square. */
const hasDiggingTool = (game: GameState) =>
  !!game.inventory["Sand Shovel"]?.gt(0) ||
  !!game.inventory["Sand Drill"]?.gt(0);

/**
 * The single Cave tutorial step active right now, or undefined once it is over.
 *
 * Runs only at Cave tier 1 with no expansion building, and ends for good when
 * the expansion barrier is tapped. Derived from state first so a returning
 * player picks up where they are rather than restarting: the first batch is
 * the bin's batch (tier 1 has one bin), and a player who has dug before but
 * has no batch is past the digging lessons.
 */
export const getCaveTutorialStep = (
  game: GameState,
  now: number,
  seen: CaveTutorialSeen,
): CaveTutorialStep | undefined => {
  const cave = game.cave;
  if (!cave || cave.tier !== 1 || cave.construction || seen.done) {
    return undefined;
  }

  // Once Gloomwick has pointed at the barrier, a new batch does not walk the
  // player back through the digging lessons.
  if (seen.expand) return "expand";

  const batch = cave.machines["1"]?.batch;
  const hasDugBefore = (game.farmActivity["Cave Tile Dug"] ?? 0) > 0;

  if (!batch) return hasDugBefore ? "expand" : "start-batch";

  if (batch.readyAt > now) return "wait";

  if (isCavePatchCleared(batch) || canRestartCaveBatch(batch)) {
    return "expand";
  }

  if (!hasDiggingTool(game)) return "buy-shovels";

  return Object.keys(batch.dug ?? {}).length ? "clue" : "dig";
};
