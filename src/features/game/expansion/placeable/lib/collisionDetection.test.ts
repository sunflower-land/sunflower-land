import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState, LandExpansion, Position } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import {
  detectCollision,
  extractResourceBoundingBoxes,
  isOverlapping,
} from "./collisionDetection";

describe("extractResourcePositions", () => {
  it("returns a list of all resource positions", () => {
    const position1: Position = { x: 1, y: 1, height: 1, width: 1 };
    const position2: Position = { x: 3, y: 1, height: 1, width: 1 };
    const position3: Position = { x: -2, y: -1, height: 2, width: 2 };
    const position4: Position = { x: -3, y: 2, height: 1, width: 2 };
    const position5: Position = { x: 0, y: -4, height: 1, width: 1 };

    const expansions: LandExpansion[] = [
      {
        shrubs: {
          0: {
            ...position1,
            wood: { amount: 0, choppedAt: 0 },
          },
        },
        pebbles: {
          0: {
            ...position2,
            stone: { amount: 0, minedAt: 0 },
          },
        },
        trees: {
          0: {
            ...position3,
            wood: { amount: 0, choppedAt: 0 },
          },
        },
        stones: {
          0: {
            ...position4,
            stone: { amount: 0, minedAt: 0 },
          },
        },
        plots: { 0: { ...position5 } },
        createdAt: 0,
        readyAt: 0,
      },
    ];

    const positions = extractResourceBoundingBoxes(expansions);

    expect(positions.sort()).toEqual(
      [position1, position2, position3, position4, position5].sort()
    );
  });
});

describe("isOverlapping", () => {
  it("returns false if there is no overlap between two positions", () => {
    const position1: Position = { x: 1, y: 1, height: 1, width: 1 };
    const position2: Position = { x: 2, y: 1, height: 1, width: 1 };

    const overlappingPosition = isOverlapping(position1, position2);

    expect(overlappingPosition).toBe(false);
  });

  it("returns true if there is an overlap between two positions", () => {
    const position1: Position = { x: 1, y: 1, height: 1, width: 2 };
    const position2: Position = { x: 2, y: 1, height: 1, width: 2 };

    const overlappingPosition = isOverlapping(position1, position2);

    expect(overlappingPosition).toBe(true);
  });
});

describe("detectCollisions", () => {
  it("returns false if a collision is not detected", () => {
    const state: GameState = cloneDeep(INITIAL_FARM);
    state.expansions = [{ createdAt: 0, readyAt: 0 }];

    const position: Position = { x: 0, y: 0, height: 1, width: 1 };

    const hasCollision = detectCollision(state, position);

    expect(hasCollision).toBe(false);
  });

  it("returns true if a collision is detected with an expansion resource", () => {
    const state: GameState = cloneDeep(INITIAL_FARM);

    const position: Position = { x: 0, y: 0, height: 1, width: 1 };

    state.expansions = [
      {
        plots: { 0: position },
        createdAt: 0,
        readyAt: 0,
      },
    ];

    const hasCollision = detectCollision(state, position);

    expect(hasCollision).toBe(true);
  });

  it("returns true if a collision is detected with water", () => {
    const state: GameState = cloneDeep(INITIAL_FARM);
    state.expansions = [{ createdAt: 0, readyAt: 0 }];

    const hasCollision = detectCollision(state, {
      x: -4,
      y: 0,
      width: 2,
      height: 1,
    });

    expect(hasCollision).toBe(true);
  });

  it("returns true if a collision is detected with a corner", () => {
    const state: GameState = cloneDeep(INITIAL_FARM);
    state.expansions = [{ createdAt: 0, readyAt: 0 }];

    const hasCollision = detectCollision(state, {
      x: -3,
      y: 3,
      width: 1,
      height: 1,
    });

    expect(hasCollision).toBe(true);
  });
});
