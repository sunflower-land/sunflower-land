import type { GameState } from "features/game/types/game";
import { BEETLES, type BeetleName } from "features/game/types/beetles";
import {
  getRevealedCaveTiles,
  isCaveSeed,
  resolveRevealedCaveTile,
} from "features/game/types/cavePatch";
import { caveTileKey } from "features/game/types/caveRecipes";

export const CAVE_FEEDBACK_DISPLAY_MS = 1200;
export const CAVE_FEEDBACK_FADE_MS = 200;

export type CaveDigFeedback =
  | { kind: "shovelSaved"; item: "Sand Shovel" }
  | { kind: "drillSaved"; item: "Sand Drill" }
  | { kind: "bonusBeetle"; item: BeetleName; amount: number };

/** Read the result of this action only; never re-roll chance skills or reuse old boost timestamps. */
export function getCaveDigFeedback({
  before,
  after,
  machineId,
  coords,
  tool,
}: {
  before: GameState;
  after: GameState;
  machineId: string;
  coords: { x: number; y: number }[];
  tool: "Sand Shovel" | "Sand Drill";
}): CaveDigFeedback[] {
  if (before === after) return [];
  const previous = before.cave?.machines[machineId]?.batch;
  const current = after.cave?.machines[machineId]?.batch;
  if (
    !previous ||
    !current ||
    !isCaveSeed(previous.seed) ||
    previous.seed !== current.seed ||
    previous.startedAt !== current.startedAt
  )
    return [];
  const unique = new Map(
    coords.map((point) => [caveTileKey(point.x, point.y), point]),
  );
  const dug = [...unique.entries()].filter(
    ([key]) => !previous.dug?.[key] && current.dug?.[key],
  );
  if (!dug.length) return [];

  const feedback: CaveDigFeedback[] = [];
  const ownedTool = before.inventory[tool];
  if (ownedTool?.gt(0) && after.inventory[tool]?.eq(ownedTool)) {
    feedback.push(
      tool === "Sand Shovel"
        ? { kind: "shovelSaved", item: tool }
        : { kind: "drillSaved", item: tool },
    );
  }
  // What each dug tile held is recorded by the dig itself.
  const revealed = getRevealedCaveTiles(current);
  const expected: Partial<Record<BeetleName, number>> = {};
  for (const [key] of dug) {
    const record = revealed[key];
    if (!record) continue;
    const tile = resolveRevealedCaveTile(record);
    for (const item of BEETLES)
      expected[item] = (expected[item] ?? 0) + (tile.items[item] ?? 0);
  }
  for (const item of BEETLES) {
    if (!expected[item]) continue;
    const gained =
      (after.inventory[item]?.toNumber() ?? 0) -
      (before.inventory[item]?.toNumber() ?? 0);
    const bonus = gained - (expected[item] ?? 0);
    if (bonus > 0) feedback.push({ kind: "bonusBeetle", item, amount: bonus });
  }
  return feedback;
}
