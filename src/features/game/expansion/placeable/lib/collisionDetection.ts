import omit from "lodash.omit";
import { GameState, LandExpansion, Position } from "features/game/types/game";
import { EXPANSION_ORIGINS, LAND_SIZE } from "../../lib/constants";
import { Coordinates } from "../../components/MapPlacement";

/**
 * Extracts positional data for all instances of a single resource
 * @param resource
 * @param expansionIndex
 * @returns Array containaing all positional data for one resource type e.g. Shrub
 */
const extract = <T extends Record<number, Position>>(
  resource: T,
  expansionIndex: number
): Position[] => {
  const { x: xOffset, y: yOffset } = EXPANSION_ORIGINS[expansionIndex];

  return Object.values(resource).map(({ x, y, height, width }) => ({
    x: x + xOffset,
    y: y + yOffset,
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
  return expansions.flatMap((expansion, expansionIndex) =>
    Object.values(omit(expansion, "terrains", "createdAt", "readyAt")).flatMap(
      (resource) => extract(resource, expansionIndex)
    )
  );
}

/**
 * Axis aligned bounding box collision detection
 * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
 */
export function isOverlapping(position1: Position, position2: Position) {
  const xmin1 = position1.x;
  const xmin2 = position2.x;

  const xmax1 = position1.x + position1.width;
  const xmax2 = position2.x + position2.width;

  const ymin1 = position1.y - position1.height;
  const ymin2 = position2.y - position2.height;

  const ymax1 = position1.y;
  const ymax2 = position2.y;

  return xmin1 < xmax2 && xmax1 > xmin2 && ymin1 < ymax2 && ymax1 > ymin2;
}

function detectResourceCollision(state: GameState, position: Position) {
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

function detectWaterCollision(state: GameState, position: Position) {
  const { expansions } = state;

  const expansionPositions: Position[] = expansions.map(
    (_, expansionIndex) => ({
      x: EXPANSION_ORIGINS[expansionIndex].x - LAND_SIZE / 2,
      y: EXPANSION_ORIGINS[expansionIndex].y + LAND_SIZE / 2,
      width: LAND_SIZE,
      height: LAND_SIZE,
    })
  );

  // Split a MxN position into 1x1 chunks
  const chunks: Position[] = Array.from({
    length: position.width * position.height,
  }).map((_, i) => ({
    x: position.x + (i % position.width),
    y: position.y - Math.floor(i / position.width),
    width: 1,
    height: 1,
  }));

  // Every 1x1 chunk needs to overlap an expansion
  return !chunks.every((chunk) =>
    expansionPositions.some((expansionPosition) =>
      isOverlapping(chunk, expansionPosition)
    )
  );
}

enum Direction {
  Left,
  Right,
  Top,
  Bottom,
}

function detectLandCornerCollision(state: GameState, position: Position) {
  const { expansions } = state;

  const origins: Coordinates[] = expansions.map((_, i) => EXPANSION_ORIGINS[i]);

  const originExistsAtOffset = (
    origin: Coordinates,
    offset: {
      x: -1 | 0 | 1;
      y: -1 | 0 | 1;
    }
  ) =>
    origins.some(
      (neighbour) =>
        neighbour.x === origin.x + LAND_SIZE * offset.x &&
        neighbour.y === origin.y + LAND_SIZE * offset.y
    );

  const hasNeighbouringOrigin = (origin: Coordinates, direction: Direction) => {
    switch (direction) {
      case Direction.Left:
        return originExistsAtOffset(origin, { x: -1, y: 0 });
      case Direction.Right:
        return originExistsAtOffset(origin, { x: 1, y: 0 });
      case Direction.Top:
        return originExistsAtOffset(origin, { x: 0, y: 1 });
      case Direction.Bottom:
        return originExistsAtOffset(origin, { x: 0, y: -1 });
    }
  };

  return origins.some((origin) => {
    const overlapsTopLeft = () =>
      !hasNeighbouringOrigin(origin, Direction.Left) &&
      !hasNeighbouringOrigin(origin, Direction.Top) &&
      isOverlapping(position, {
        x: origin.x - LAND_SIZE / 2,
        y: origin.y + LAND_SIZE / 2,
        width: 1,
        height: 1,
      });

    const overlapsTopRight = () =>
      !hasNeighbouringOrigin(origin, Direction.Right) &&
      !hasNeighbouringOrigin(origin, Direction.Top) &&
      isOverlapping(position, {
        x: origin.x + LAND_SIZE / 2 - 1,
        y: origin.y + LAND_SIZE / 2,
        width: 1,
        height: 1,
      });

    const overlapsBottomLeft = () =>
      !hasNeighbouringOrigin(origin, Direction.Left) &&
      !hasNeighbouringOrigin(origin, Direction.Bottom) &&
      isOverlapping(position, {
        x: origin.x - LAND_SIZE / 2,
        y: origin.y - LAND_SIZE / 2 + 1,
        width: 1,
        height: 1,
      });

    const overlapsBottomRight = () =>
      !hasNeighbouringOrigin(origin, Direction.Right) &&
      !hasNeighbouringOrigin(origin, Direction.Bottom) &&
      isOverlapping(position, {
        x: origin.x + LAND_SIZE / 2 - 1,
        y: origin.y - LAND_SIZE / 2 + 1,
        width: 1,
        height: 1,
      });

    return (
      overlapsTopLeft() ||
      overlapsTopRight() ||
      overlapsBottomLeft() ||
      overlapsBottomRight()
    );
  });
}

export function detectCollision(state: GameState, position: Position) {
  return (
    detectWaterCollision(state, position) ||
    detectResourceCollision(state, position) ||
    detectLandCornerCollision(state, position)
  );
}
