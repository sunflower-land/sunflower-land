import { Coordinates } from "features/game/expansion/components/MapPlacement";
import {
  Collectibles,
  GameState,
  Position,
  Rock,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { canMine } from "./stoneMine";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { isWithinAOE } from "features/game/expansion/placeable/lib/collisionDetection";

export enum MOVE_STONE_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  STONE_NOT_PLACED = "This stone is not placed!",
  AOE_LOCKED = "This rock is within the AOE",
}

export type MoveStoneAction = {
  type: "stone.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveStoneAction;
  createdAt?: number;
};

function isAOELocked(
  rock: Rock,
  collectibles: Collectibles,
  createdAt: number
): boolean {
  const minedAt = rock.stone.minedAt;

  if (!minedAt) return false;

  if (canMine(rock, createdAt)) return false;

  if (collectibles["Emerald Turtle"]?.[0]) {
    const turtleCoordinates = collectibles["Emerald Turtle"]?.[0].coordinates;
    const scarecrowDimensions = COLLECTIBLES_DIMENSIONS["Emerald Turtle"];

    const turtlePosition: Position = {
      x: turtleCoordinates.x,
      y: turtleCoordinates.y,
      height: scarecrowDimensions.height,
      width: scarecrowDimensions.width,
    };

    const plotPosition: Position = {
      x: rock?.x,
      y: rock?.y,
      height: rock.height,
      width: rock.width,
    };

    if (isWithinAOE("Emerald Turtle", turtlePosition, plotPosition)) {
      return true;
    }
  } else if (collectibles["Tin Turtle"]?.[0]) {
    const turtleCoordinates = collectibles["Tin Turtle"]?.[0].coordinates;
    const scarecrowDimensions = COLLECTIBLES_DIMENSIONS["Tin Turtle"];

    const turtlePosition: Position = {
      x: turtleCoordinates.x,
      y: turtleCoordinates.y,
      height: scarecrowDimensions.height,
      width: scarecrowDimensions.width,
    };

    const plotPosition: Position = {
      x: rock?.x,
      y: rock?.y,
      height: rock.height,
      width: rock.width,
    };

    if (isWithinAOE("Tin Turtle", turtlePosition, plotPosition)) {
      return true;
    }
  }

  return false;
}

export function moveStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const stones = stateCopy.stones;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_STONE_ERRORS.NO_BUMPKIN);
  }

  if (!stones[action.id]) {
    throw new Error(MOVE_STONE_ERRORS.STONE_NOT_PLACED);
  }

  if (isAOELocked(stones[action.id], stateCopy.collectibles, createdAt)) {
    throw new Error(MOVE_STONE_ERRORS.AOE_LOCKED);
  }

  stones[action.id].x = action.coordinates.x;
  stones[action.id].y = action.coordinates.y;

  return stateCopy;
}
