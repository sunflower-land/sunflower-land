import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Collectibles, GameState, Rock } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { canMine } from "./stoneMine";
import { isAOEImpacted } from "features/game/expansion/placeable/lib/collisionDetection";

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

export function isLocked(
  rock: Rock,
  collectibles: Collectibles,
  createdAt: number,
): boolean {
  const minedAt = rock.stone.minedAt;

  if (!minedAt) return false;

  if (canMine(rock, createdAt)) return false;

  return isAOEImpacted(collectibles, rock, ["Emerald Turtle", "Tin Turtle"]);
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

  if (isLocked(stones[action.id], stateCopy.collectibles, createdAt)) {
    throw new Error(MOVE_STONE_ERRORS.AOE_LOCKED);
  }

  stones[action.id].x = action.coordinates.x;
  stones[action.id].y = action.coordinates.y;

  return stateCopy;
}
