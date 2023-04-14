import { Coordinates } from "features/game/expansion/components/MapPlacement";

export type Layout = {
  "Crop Plot": Coordinates[];
  Tree: Coordinates[];
  "Stone Rock": Coordinates[];
  "Iron Rock": Coordinates[];
  "Gold Rock": Coordinates[];
  "Fruit Patch": Coordinates[];
  Boulder: Coordinates[];
};

export const INITIAL_LAYOUTS: Record<string, Layout> = {};
