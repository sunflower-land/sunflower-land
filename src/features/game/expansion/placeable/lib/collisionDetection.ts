import { GameState, LandExpansion, Position } from "features/game/types/game";

/**
 * Extracts positional data for all instances of a single resource
 * @param resource
 * @returns Array containaing all positionial data for one resource type eg Shrub
 */
const extract = <T extends Record<number, Position>>(
  resource: T
): Position[] => {
  return Object.values(resource).map(({ x, y, height, width }) => ({
    x,
    y,
    height,
    width,
  }));
};

/**
 * Extracts the positional data from all the resources on all land expansions.
 * @param expansions
 * @returns Array of all resource positions
 */
export function extractResourcePositions(
  expansions: Required<
    Omit<LandExpansion, "terrains" | "createdAt" | "readyAt">
  >[]
) {
  return expansions.flatMap((expansion) =>
    Object.values(expansion).flatMap(extract)
  );
}

export function detectCollision(state: GameState, position: Position) {
  const { expansions } = state;

  const resourcesFromExpansions = expansions.map((expansion) => ({
    shrubs: expansion.shrubs ?? {},
    pebbles: expansion.pebbles ?? {},
    trees: expansion.trees ?? {},
    stones: expansion.stones ?? {},
    plots: expansion.plots ?? {},
    createdAt: 0,
  }));

  const positions = extractResourcePositions(resourcesFromExpansions);

  return { hasCollision: false };
}
