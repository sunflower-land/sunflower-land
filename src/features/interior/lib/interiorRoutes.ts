/**
 * The interior floors are mounted twice: at `/interior` + `/level_one` for the
 * player's own farm, and under `/visit/:id/...` for a farm they're visiting.
 *
 * Every in-world link (stairs, upgrade flow, empty-state buttons) has to keep
 * the visit prefix — a bare `/interior` on a visited farm silently teleports
 * the player into their own house instead.
 */
export type InteriorFloor = "ground" | "level_one";

const FLOOR_PATH: Record<InteriorFloor, string> = {
  ground: "interior",
  level_one: "level_one",
};

export function getInteriorRoute({
  floor,
  visitedFarmId,
}: {
  floor: InteriorFloor;
  /** The farm being visited, or `undefined` when on the player's own farm. */
  visitedFarmId?: number;
}): string {
  const path = FLOOR_PATH[floor];

  return visitedFarmId === undefined
    ? `/${path}`
    : `/visit/${visitedFarmId}/${path}`;
}

/**
 * Where the interior's exit button should drop the player — back onto the land
 * they came from, which is the visited farm rather than their own while
 * visiting.
 */
export function getInteriorExitRoute({
  visitedFarmId,
}: {
  visitedFarmId?: number;
}): string {
  return visitedFarmId === undefined ? "/" : `/visit/${visitedFarmId}`;
}
