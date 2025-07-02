import { Decoration } from "features/game/types/decorations";
import { IslandType } from "features/game/types/game";

export type LandBiomes =
  | "Basic Biome"
  | "Spring Biome"
  | "Desert Biome"
  | "Volcano Biome";

type Biome = Omit<Decoration, "name"> & {
  name: LandBiomes;
  flowerUSD?: number;
  requires?: IslandType;
};

export const LAND_BIOMES: Record<LandBiomes, Biome> = {
  "Basic Biome": {
    name: "Basic Biome",
    ingredients: {},
    description: "",
    requires: "basic",
  },
  "Spring Biome": {
    name: "Spring Biome",
    ingredients: {},
    description: "",
    requires: "spring",
  },
  "Desert Biome": {
    name: "Desert Biome",
    ingredients: {},
    description: "",
    requires: "desert",
  },
  "Volcano Biome": {
    name: "Volcano Biome",
    ingredients: {},
    description: "",
    requires: "volcano",
  },
};
