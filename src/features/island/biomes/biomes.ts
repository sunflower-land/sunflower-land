import Decimal from "decimal.js-light";
import { Decoration } from "features/game/types/decorations";
import { IslandType } from "features/game/types/game";

export type LandBiomeName = `${Capitalize<IslandType>} Biome`;

export type Biome = Omit<Decoration, "name"> & {
  name: LandBiomeName;
  requires?: IslandType;
};

export const LAND_BIOMES: Record<LandBiomeName, Biome> = {
  "Basic Biome": {
    name: "Basic Biome",
    ingredients: {
      Gem: new Decimal(1000),
    },
    description: "",
    requires: "basic",
  },
  "Spring Biome": {
    name: "Spring Biome",
    ingredients: {
      Gem: new Decimal(1000),
    },
    description: "",
    requires: "spring",
  },
  "Desert Biome": {
    name: "Desert Biome",
    ingredients: {
      Gem: new Decimal(1000),
    },
    description: "",
    requires: "desert",
  },
  "Volcano Biome": {
    name: "Volcano Biome",
    ingredients: {
      Gem: new Decimal(1000),
    },
    description: "",
    requires: "volcano",
  },
};
