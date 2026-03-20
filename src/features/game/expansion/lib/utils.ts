import { Collectibles, Rock } from "features/game/types/game";
import isEqual from "lodash.isequal";
import { getObjectEntries } from "lib/object";

export function canMine(
  rock: Rock,
  recoveryTime: number,
  now: number = Date.now(),
) {
  return now - rock.stone.minedAt >= recoveryTime * 1000;
}

interface ResourceObject {
  [id: string]: {
    x?: number;
    y?: number;
  };
}

export const getSortedResourcePositions = (object: ResourceObject) => {
  return getObjectEntries(object)
    .filter(([, item]) => item.x !== undefined && item.y !== undefined)
    .map(([id, item]) => ({ id, x: item.x as number, y: item.y as number }))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
};

export const getSortedCollectiblePositions = (object: Collectibles) => {
  return getObjectEntries(object)
    .flatMap(([name, value]) => value?.map((item) => ({ name, item })))
    .filter(
      (collectible): collectible is NonNullable<typeof collectible> =>
        !!(collectible && collectible.item.coordinates !== undefined),
    )
    .map(({ name, item }) => ({
      id: item.id,
      x: item.coordinates!.x,
      y: item.coordinates!.y,
      flipped: item.flipped,
      name,
    }));
};

export function comparePositions(prev: any, next: any) {
  return isEqual(prev.positions, next.positions);
}

export type SaltFarmLayoutSlice = {
  positions: { id: string; x: number; y: number }[];
  saltFarmLevel: number;
  basicLand: number;
  saltNodeIds: string[];
};

export function compareSaltFarmSlice(
  prev: SaltFarmLayoutSlice,
  next: SaltFarmLayoutSlice,
) {
  return (
    isEqual(prev.positions, next.positions) &&
    prev.saltFarmLevel === next.saltFarmLevel &&
    prev.basicLand === next.basicLand &&
    isEqual(prev.saltNodeIds, next.saltNodeIds)
  );
}
