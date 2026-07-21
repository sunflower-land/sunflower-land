import Decimal from "decimal.js-light";
import type { Decoration } from "features/game/types/decorations";
import type { GameState, IslandType } from "features/game/types/game";
import { capitalize } from "lib/utils/capitalize";

export type LandBiomeName =
  | `${Capitalize<Exclude<IslandType, "marble">>} Biome`
  | "Marble Age Biome";

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
    ingredients: {},
    description: "",
    requires: "swamp",
  },
  "Swamp Biome": {
    name: "Swamp Biome",
    ingredients: {},
    description: "",
    requires: "spooky",
  },
  "Spooky Biome": {
    name: "Spooky Biome",
    ingredients: {},
    description: "",
    requires: "crystal",
  },
  "Crystal Biome": {
    name: "Crystal Biome",
    ingredients: {},
    description: "",
    requires: "galaxy",
  },
  "Galaxy Biome": {
    name: "Galaxy Biome",
    ingredients: {},
    description: "",
    requires: "marble",
  },
  "Marble Age Biome": {
    name: "Marble Age Biome",
    ingredients: {},
    description: "",
    requires: "marble",
  },
};
export function getCurrentBiome(island: GameState["island"]): LandBiomeName {
  return (
    island.biome ??
    // Marble is the only island whose biome isn't `${Capitalize<type>} Biome`.
    (island.type === "marble"
      ? "Marble Age Biome"
      : (`${capitalize(island.type)} Biome` as LandBiomeName))
  );
}
