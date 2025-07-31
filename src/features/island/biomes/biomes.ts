import Decimal from "decimal.js-light";
import { Decoration } from "features/game/types/decorations";
import { GameState, IslandType } from "features/game/types/game";
import { capitalize } from "lib/utils/capitalize";

export type LandBiomeName = `${Capitalize<IslandType>} Biome`;

export type Biome = Omit<Decoration, "name"> & {
  name: LandBiomeName;
  requires?: IslandType;
  disabled?: boolean;
};

export const LAND_BIOMES: Record<LandBiomeName, Biome> = {
  "Basic Biome": {
    name: "Basic Biome",
    ingredients: {
      Gem: new Decimal(500),
      Wool: new Decimal(1000),
      Honey: new Decimal(500),
    },
    description: "",
    requires: "spring",
  },
  "Spring Biome": {
    name: "Spring Biome",
    ingredients: {
      Gem: new Decimal(1000),
      Wool: new Decimal(2000),
      Crimstone: new Decimal(100),
    },
    description: "",
    requires: "desert",
  },
  "Desert Biome": {
    name: "Desert Biome",
    ingredients: {
      Gem: new Decimal(1500),
      Leather: new Decimal(1000),
      Oil: new Decimal(500),
    },
    description: "",
    requires: "volcano",
  },
  "Volcano Biome": {
    name: "Volcano Biome",
    ingredients: {
      Gem: new Decimal(2000),
      Leather: new Decimal(1500),
      Obsidian: new Decimal(25),
    },
    description: "",
    disabled: true,
  },
};
export function getCurrentBiome(island: GameState["island"]): LandBiomeName {
  return island.biome ?? (`${capitalize(island.type)} Biome` as LandBiomeName);
}
