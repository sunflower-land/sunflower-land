import { GameState, LandExpansion, Position } from "features/game/types/game";
import { EXPANSION_ORIGINS, LAND_SIZE } from "../../lib/constants";
import { Coordinates } from "../../components/MapPlacement";

type BoundingBox = Position;

/**
 * Extracts the bounding box for a collection of resources e.g. Shrubs.
 * @param resource
 * @param expansionIndex
 * @returns Array of bounding boxes
 */
const extractBoundingBox = <T extends Record<number, BoundingBox>>(
  resource: T,
  expansionIndex: number
): BoundingBox[] => {
  const { x: xOffset, y: yOffset } = EXPANSION_ORIGINS[expansionIndex];

  return Object.values(resource).map(({ x, y, height, width }) => ({
    x: x + xOffset,
    y: y + yOffset,
    height,
    width,
  }));
};

type Resources = Required<
  Omit<LandExpansion, "terrains" | "createdAt" | "readyAt">
>;

const getAllResources = (expansions: LandExpansion[]): Resources[] => {
  return expansions.map((expansion) => ({
    shrubs: expansion.shrubs ?? {},
    pebbles: expansion.pebbles ?? {},
    trees: expansion.trees ?? {},
    stones: expansion.stones ?? {},
    plots: expansion.plots ?? {},
  }));
};

export const getBoundingBoxes = (
  expansionResources: Resources,
  expansionIndex: number
) => {
  const resources = Object.values(expansionResources);

  const boundingBoxes = resources.flatMap((resource) => {
    return extractBoundingBox(resource, expansionIndex);
  });

  return boundingBoxes;
};
/**
 * Extracts the bounding boxes for all resources on all land expansions.
 * @param expansions
 * @returns Array of all bounding boxes
 */
export function extractResourceBoundingBoxes(
  expansions: LandExpansion[]
): BoundingBox[] {
  const allResources = getAllResources(expansions);

  return allResources.flatMap(getBoundingBoxes);
}

/**
 * Axis aligned bounding box collision detection
 * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
 */
export function isOverlapping(
  boundingBox1: BoundingBox,
  boundingBox2: BoundingBox
) {
  const xmin1 = boundingBox1.x;
  const xmin2 = boundingBox2.x;

  const xmax1 = boundingBox1.x + boundingBox1.width;
  const xmax2 = boundingBox2.x + boundingBox2.width;

  const ymin1 = boundingBox1.y - boundingBox1.height;
  const ymin2 = boundingBox2.y - boundingBox2.height;

  const ymax1 = boundingBox1.y;
  const ymax2 = boundingBox2.y;

  return xmin1 < xmax2 && xmax1 > xmin2 && ymin1 < ymax2 && ymax1 > ymin2;
}

const splitBoundingBox = (boundingBox: BoundingBox) => {
  const boxCount = boundingBox.width * boundingBox.height;

  return Array.from({ length: boxCount }).map((_, i) => ({
    x: boundingBox.x + (i % boundingBox.width),
    y: boundingBox.y - Math.floor(i / boundingBox.width),
    width: 1,
    height: 1,
  }));
};

function detectResourceCollision(state: GameState, boundingBox: BoundingBox) {
  const { expansions } = state;

  const resourceBoundingBoxes = extractResourceBoundingBoxes(expansions);

  return resourceBoundingBoxes.some((resourceBoundingBox) =>
    isOverlapping(boundingBox, resourceBoundingBox)
  );
}

function detectWaterCollision(state: GameState, boundingBox: BoundingBox) {
  const { expansions } = state;

  const expansionBoundingBoxes: BoundingBox[] = expansions.map(
    (_, expansionIndex) => ({
      x: EXPANSION_ORIGINS[expansionIndex].x - LAND_SIZE / 2,
      y: EXPANSION_ORIGINS[expansionIndex].y + LAND_SIZE / 2,
      width: LAND_SIZE,
      height: LAND_SIZE,
    })
  );

  /**
   * A bounding box may overlap multiple land expansions.
   *
   * To check if a bounding box completely overlaps land, the
   * bounding box is split into smaller, 1 by 1 bounding boxes,
   * and each box is checked independently.
   */
  const isOverlappingExpansion = (boundingBox: BoundingBox) => {
    return expansionBoundingBoxes.some((expansionBoundingBox) =>
      isOverlapping(boundingBox, expansionBoundingBox)
    );
  };
  const smallerBoxes = splitBoundingBox(boundingBox);
  const isOverLand = smallerBoxes.every(isOverlappingExpansion);

  return !isOverLand;
}

enum Direction {
  Left,
  Right,
  Top,
  Bottom,
}

function detectLandCornerCollision(state: GameState, boundingBox: BoundingBox) {
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
