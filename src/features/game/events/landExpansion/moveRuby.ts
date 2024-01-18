import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { GameState, Rock } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";
import { canMine } from "./stoneMine";

export enum MOVE_RUBY_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  RUBY_NOT_PLACED = "This ruby is not placed!",
  AOE_LOCKED = "This rock is within the AOE",
}

export type MoveRubyAction = {
  type: "ruby.moved";
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveRubyAction;
  createdAt?: number;
};

export function isLocked(rock: Rock, createdAt: number): boolean {
  const minedAt = rock.stone.minedAt;

  if (!minedAt) return false;

  if (canMine(rock, createdAt)) return false;

  return false;
}

export function moveRuby({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state) as GameState;
  const rubies = stateCopy.rubies;

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_RUBY_ERRORS.NO_BUMPKIN);
  }

  if (!rubies[action.id]) {
    throw new Error(MOVE_RUBY_ERRORS.RUBY_NOT_PLACED);
  }

  if (isLocked(rubies[action.id], createdAt)) {
    throw new Error(MOVE_RUBY_ERRORS.AOE_LOCKED);
  }

  rubies[action.id].x = action.coordinates.x;
  rubies[action.id].y = action.coordinates.y;

  return stateCopy;
}
