import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { canMine } from "features/game/expansion/lib/utils";
import { isAOEImpacted } from "features/game/expansion/placeable/lib/collisionDetection";
import { IRON_RECOVERY_TIME } from "features/game/lib/constants";
import { Collectibles, GameState, Rock } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { produce } from "immer";

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

export function isLocked(
  rock: Rock,
  collectibles: Collectibles,
  createdAt: number,
  bumpkin: GameState["bumpkin"],
): boolean {
  const minedAt = rock.stone.minedAt;

  if (!minedAt) return false;

  if (canMine(rock, IRON_RECOVERY_TIME, createdAt)) return false;

  return isAOEImpacted(
    collectibles,
    { ...rock, ...RESOURCE_DIMENSIONS["Iron Rock"] },
    ["Emerald Turtle"],
    bumpkin,
  );
}

export function moveIron({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const iron = stateCopy.iron;

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_IRON_ERRORS.NO_BUMPKIN);
    }

    if (!iron[action.id]) {
      throw new Error(MOVE_IRON_ERRORS.IRON_NOT_PLACED);
    }

    if (
      isLocked(
        iron[action.id],
        stateCopy.collectibles,
        createdAt,
        stateCopy.bumpkin,
      )
    ) {
      throw new Error(MOVE_IRON_ERRORS.AOE_LOCKED);
    }

    iron[action.id].x = action.coordinates.x;
    iron[action.id].y = action.coordinates.y;

    return stateCopy;
  });
}
