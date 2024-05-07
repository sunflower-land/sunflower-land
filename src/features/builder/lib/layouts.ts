import { Coordinates } from "features/game/expansion/components/MapPlacement";

export type Layout = {
  plots: Coordinates[];
  trees: Coordinates[];
  stones: Coordinates[];
  iron: Coordinates[];
  gold: Coordinates[];
  crimstones: Coordinates[];
  sunstones: Coordinates[];
  fruitPatches: Coordinates[];
  boulder: Coordinates[];
  beehives: Coordinates[];
  flowers: Coordinates[];
  oilReserves: Coordinates[];
};

export const INITIAL_LAYOUTS: Record<string, Layout> = {};
