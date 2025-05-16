import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { canMine } from "features/game/expansion/lib/utils";
import { isAOEImpacted } from "features/game/expansion/placeable/lib/collisionDetection";
import { GOLD_RECOVERY_TIME } from "features/game/lib/constants";
import { Collectibles, GameState, Rock } from "features/game/types/game";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { produce } from "immer";

export enum MOVE_GOLD_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  GOLD_NOT_PLACED = "This gold is not placed!",
  AOE_LOCKED = "This rock is within the AOE",
}

export type MoveGoldAction = {
  type: "gold.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveGoldAction;
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

  if (canMine(rock, GOLD_RECOVERY_TIME, createdAt)) return false;

  return isAOEImpacted(
    collectibles,
    { ...rock, ...RESOURCE_DIMENSIONS["Gold Rock"] },
    ["Emerald Turtle"],
    bumpkin,
  );
}

export function moveGold({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const gold = stateCopy.gold;

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_GOLD_ERRORS.NO_BUMPKIN);
    }

    if (!gold[action.id]) {
      throw new Error(MOVE_GOLD_ERRORS.GOLD_NOT_PLACED);
    }

    if (
      isLocked(
        gold[action.id],
        stateCopy.collectibles,
        createdAt,
        stateCopy.bumpkin,
      )
    ) {
      throw new Error(MOVE_GOLD_ERRORS.AOE_LOCKED);
    }

    gold[action.id].x = action.coordinates.x;
    gold[action.id].y = action.coordinates.y;

    return stateCopy;
  });
}
