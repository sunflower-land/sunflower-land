import omit from "lodash.omit";
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
    Object.values(omit(expansion, "terrains", "createdAt", "readyAt")).flatMap(
      extract
    )
  );
}

/**
 * Axis aligned bounding box collision detection
 * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
 */
export function isOverlapping(position1: Position, position2: Position) {
  return (
    position1.x < position2.x + position2.width &&
    position1.x + position1.width > position2.x &&
    position1.y < position2.y + position2.height &&
    position1.height + position1.y > position2.y
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
  }));

  const resourcePositions = extractResourcePositions(resourcesFromExpansions);

  return resourcePositions.some((resourcePosition) =>
    isOverlapping(position, resourcePosition)
  );
}
