import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Collectibles, GameState, Rock } from "features/game/types/game";
import { canMine } from "./stoneMine";
import { isAOEImpacted } from "features/game/expansion/placeable/lib/collisionDetection";
import { produce } from "immer";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

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
  bumpkin: GameState["bumpkin"],
): boolean {
  const minedAt = rock.stone.minedAt;

  if (!minedAt) return false;

  if (canMine(rock, createdAt)) return false;

  return isAOEImpacted(
    collectibles,
    { ...rock, ...RESOURCE_DIMENSIONS["Stone Rock"] },
    ["Emerald Turtle", "Tin Turtle"],
    bumpkin,
  );
}

export function moveStone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const stones = stateCopy.stones;

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_STONE_ERRORS.NO_BUMPKIN);
    }

    if (!stones[action.id]) {
      throw new Error(MOVE_STONE_ERRORS.STONE_NOT_PLACED);
    }

    if (
      isLocked(
        stones[action.id],
        stateCopy.collectibles,
        createdAt,
        stateCopy.bumpkin,
      )
    ) {
      throw new Error(MOVE_STONE_ERRORS.AOE_LOCKED);
    }

    stones[action.id].x = action.coordinates.x;
    stones[action.id].y = action.coordinates.y;

    return stateCopy;
  });
}
