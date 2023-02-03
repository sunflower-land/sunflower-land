import { Coordinates } from "features/game/expansion/components/MapPlacement";

export function getDistance(first: Coordinates, second: Coordinates) {
  const y = first.x - second.x;
  const x = first.y - second.y;

  return Math.sqrt(x * x + y * y);
}
