import { LandscapingPlaceable } from "features/game/expansion/placeable/landscapingMachine";
import { BUILDINGS, BuildingName } from "features/game/types/buildings";
import {
  COLLECTIBLES_DIMENSIONS,
  CollectibleName,
} from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import {
  RESOURCE_STATE_ACCESSORS,
  ResourceName,
} from "features/game/types/resources";
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
  name: LandscapingPlaceable;
}) {
  const game = cloneDeep(state);

  if (name in RESOURCE_STATE_ACCESSORS) {
    const attributeMapping =
      RESOURCE_STATE_ACCESSORS[name as Exclude<ResourceName, "Boulder">];
    delete attributeMapping(game)[id];
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

  if (name === "Bud") {
    delete game.buds?.[Number(id)].coordinates;
    return game;
  }

  if (name === "Pet") {
    delete game.pets?.nfts?.[Number(id)].coordinates;
    return game;
  }

  if (name === "FarmHand") {
    const farmHand = game.farmHands.bumpkins[id];
    if (farmHand) {
      delete farmHand.coordinates;
      delete farmHand.location;
    }
    return game;
  }

  return game;
}
