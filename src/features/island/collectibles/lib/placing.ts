import { BUILDINGS } from "features/game/types/buildings";
import { BuildingName } from "features/game/types/buildings";
import { PlaceableName } from "features/game/types/buildings";
import { CollectibleName } from "features/game/types/craftables";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

/**
 * Removes a placeable item from the game state
 */
export function removePlaceable({
  state,
  id,
  name,
}: {
  state: GameState;
  id: string;
  name: PlaceableName | "Bud";
}) {
  const game = cloneDeep(state);
  if (name === "Crop Plot") {
    delete game.crops[id];
    return game;
  }

  if (name === "Tree") {
    delete game.trees[id];
    return game;
  }

  if (name === "Stone Rock") {
    delete game.stones[id];
    return game;
  }

  if (name === "Iron Rock") {
    delete game.iron[id];
    return game;
  }

  if (name === "Gold Rock") {
    delete game.gold[id];
    return game;
  }

  if (name === "Crimstone Rock") {
    delete game.crimstones[id];
    return game;
  }

  if (name === "Sunstone Rock") {
    delete game.sunstones[id];
    return game;
  }

  if (name === "Fruit Patch") {
    delete game.fruitPatches[id];
    return game;
  }

  if (name === "Beehive") {
    delete game.beehives[id];
    return game;
  }

  if (name === "Flower Bed") {
    delete game.flowers.flowerBeds[id];
    return game;
  }

  if (name in BUILDINGS) {
    game.buildings[name as BuildingName] = game.buildings[
      name as BuildingName
    ]?.filter((b) => b.id !== id);
    return game;
  }

  if (name in COLLECTIBLES_DIMENSIONS) {
    game.collectibles[name as CollectibleName] = game.collectibles[
      name as CollectibleName
    ]?.filter((b) => b.id !== id);
    return game;
  }

  if (name === "Chicken") {
    delete game.chickens[id];
    return game;
  }

  if (name === "Bud") {
    delete game.buds?.[Number(id)].coordinates;
    return game;
  }

  return game;
}
