import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState, Rock } from "features/game/types/game";
import { canMine } from "features/game/lib/resourceNodes";
import { produce } from "immer";

export enum MOVE_CRIMSTONE_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  CRIMSTONE_NOT_PLACED = "This crimstone is not placed!",
  AOE_LOCKED = "This rock is within the AOE",
}

export type MoveCrimstoneAction = {
  type: "crimstone.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveCrimstoneAction;
  createdAt?: number;
};

export function isLocked(rock: Rock, createdAt: number): boolean {
  const minedAt = rock.stone.minedAt;

  if (!minedAt) return false;

  if (canMine(rock, "Crimstone Rock", createdAt)) return false;

  return false;
}

export function moveCrimstone({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const crimstones = stateCopy.crimstones;

    if (stateCopy.bumpkin === undefined) {
      throw new Error(MOVE_CRIMSTONE_ERRORS.NO_BUMPKIN);
    }

    if (!crimstones[action.id]) {
      throw new Error(MOVE_CRIMSTONE_ERRORS.CRIMSTONE_NOT_PLACED);
    }

    if (isLocked(crimstones[action.id], createdAt)) {
      throw new Error(MOVE_CRIMSTONE_ERRORS.AOE_LOCKED);
    }

    crimstones[action.id].x = action.coordinates.x;
    crimstones[action.id].y = action.coordinates.y;

    return stateCopy;
  });
}
