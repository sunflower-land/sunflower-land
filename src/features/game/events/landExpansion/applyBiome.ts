import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { GameState } from "features/game/types/game";
import {
  LandBiomeName,
  LAND_BIOMES,
  getCurrentBiome,
} from "features/island/biomes/biomes";
import { produce } from "immer";

export interface ApplyBiomeAction {
  type: "biome.applied";
  biome: LandBiomeName;
}

type Options = {
  state: Readonly<GameState>;
  action: ApplyBiomeAction;
  createdAt?: number;
};

export function applyBiome({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const { biome } = action;
    const hasBiome = game.inventory[biome]?.gt(0);

    if (!hasBiome) {
      throw new Error("You do not own this biome");
    }

    const biomeData = LAND_BIOMES[biome];

    if (!hasRequiredIslandExpansion(game.island.type, biomeData.requires)) {
      throw new Error("You are not permitted to apply this biome");
    }

    // Unapply the biome to the default biome if player selects the same biome as their current biome
    if (getCurrentBiome(game.island) === biome) {
      if (!game.island.biome) {
        throw new Error("You are already in this biome");
      }
      delete game.island.biome;
      return game; // early return
    }

    game.island.biome = biome;

    return game;
  });
}
