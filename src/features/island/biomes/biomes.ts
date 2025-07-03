import Decimal from "decimal.js-light";
import { Decoration } from "features/game/types/decorations";
import { IslandType } from "features/game/types/game";

export type LandBiomeName = `${Capitalize<IslandType>} Biome`;

type Biome = Omit<Decoration, "name"> & {
  name: LandBiomeName;
  requires?: IslandType;
  limit?: number;
};

export const LAND_BIOMES: Record<LandBiomeName, Biome> = {
  "Basic Biome": {
    name: "Basic Biome",
    ingredients: {
      Gem: new Decimal(1000),
    },
    description: "",
    requires: "basic",
    limit: 1,
  },
  "Spring Biome": {
    name: "Spring Biome",
    ingredients: {
      Gem: new Decimal(1000),
    },
    description: "",
    requires: "spring",
    limit: 1,
  },
  "Desert Biome": {
    name: "Desert Biome",
    ingredients: {
      Gem: new Decimal(1000),
    },
    description: "",
    requires: "desert",
    limit: 1,
  },
  "Volcano Biome": {
    name: "Volcano Biome",
    ingredients: {
      Gem: new Decimal(1000),
    },
    description: "",
    requires: "volcano",
    limit: 1,
  },
};
