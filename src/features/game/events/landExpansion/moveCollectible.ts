import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { CollectibleName } from "features/game/types/craftables";
import { Collectibles, GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export const MOVE_COLLECTIBLE_SECONDS: Partial<
  Record<CollectibleName, number>
> = {
  // AOE items
  "Basic Scarecrow": 60 * 10,
  "Emerald Turtle": 60 * 60 * 24 + 100,
  "Tin Turtle": 60 * 60 * 4 + 100,
};

export enum MOVE_COLLECTIBLE_ERRORS {
  NO_BUMPKIN = "You do not have a Bumpkin!",
  NO_COLLECTIBLES = "You don't have any collectible of this type placed!",
  COLLECTIBLE_NOT_PLACED = "This collectible is not placed!",
}

export type MoveCollectibleAction = {
  type: "collectible.moved";
  name: CollectibleName;
  coordinates: Coordinates;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: MoveCollectibleAction;
  createdAt?: number;
};

function getAOECooldown({
  name,
  collectibles,
  createdAt,
}: {
  name: CollectibleName;
  collectibles: Collectibles;
  createdAt: number;
}): number {
  const collectibleGroup = collectibles[name];
  const cooldown = COLLECTIBLE_PLACE_SECONDS[name] || 0;

  return collectibleGroup ? createdAt + cooldown * 1000 : 0;
}

export function moveCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  console.log({ action });
  const stateCopy = cloneDeep(state) as GameState;
  const collectibleGroup = stateCopy.collectibles[action.name];

  if (stateCopy.bumpkin === undefined) {
    throw new Error(MOVE_COLLECTIBLE_ERRORS.NO_BUMPKIN);
  }

  if (!collectibleGroup) {
    throw new Error(MOVE_COLLECTIBLE_ERRORS.NO_COLLECTIBLES);
  }

  const collectibleToMoveIndex = collectibleGroup.findIndex(
    (collectible) => collectible.id === action.id
  );

  if (collectibleToMoveIndex < 0) {
    throw new Error(MOVE_COLLECTIBLE_ERRORS.COLLECTIBLE_NOT_PLACED);
  }

  collectibleGroup[collectibleToMoveIndex].readyAt = getAOECooldown({
    name: action.name,
    collectibles: stateCopy.collectibles,
    createdAt,
  });

  collectibleGroup[collectibleToMoveIndex].coordinates = action.coordinates;

  return stateCopy;
}
