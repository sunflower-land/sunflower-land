import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { canMine } from "features/game/expansion/lib/utils";
import { isWithinAOE } from "features/game/expansion/placeable/lib/collisionDetection";
import { IRON_RECOVERY_TIME } from "features/game/lib/constants";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import {
  Collectibles,
  GameState,
  Position,
  Rock,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export enum MOVE_IRON_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_IRON = "You don't have any iron placed!",
  IRON_NOT_PLACED = "This rock is not placed!",
  AOE_LOCKED = "This rock is within the AOE",
}

export type MoveIronAction = {
  type: "iron.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveIronAction;
  createdAt?: number;
};

function isAOELocked(
  rock: Rock,
  collectibles: Collectibles,
  createdAt: number
): boolean {
  const minedAt = rock.stone.minedAt;

  if (!minedAt) return false;

  if (canMine(rock, IRON_RECOVERY_TIME, createdAt)) return false;

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
  }

  return false;
}

export function moveIron({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const iron = stateCopy.iron;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_IRON_ERRORS.NO_BUMPKIN);
  }

  if (!iron[action.id]) {
    throw new Error(MOVE_IRON_ERRORS.IRON_NOT_PLACED);
  }

  if (isAOELocked(iron[action.id], stateCopy.collectibles, createdAt)) {
    throw new Error(MOVE_IRON_ERRORS.AOE_LOCKED);
  }

  iron[action.id].x = action.coordinates.x;
  iron[action.id].y = action.coordinates.y;

  return stateCopy;
}
