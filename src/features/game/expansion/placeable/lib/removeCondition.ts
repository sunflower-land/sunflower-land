import {
  areUnsupportedChickensBrewing,
  removeUnsupportedCrops,
} from "features/game/events/landExpansion/removeBuilding";
import { PlaceableName } from "features/game/types/buildings";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

/**
 * Checks whether a placeable is removable or not.
 * @param gameState The game state.
 * @param name The placeable name.
 * @param name The placeable ID.
 * @returns true if the placeable can be removed, else false.
 */
export const isRemovable = (
  gameState: GameState,
  name: PlaceableName,
  placeableId: string
) => {
  if (name === "Hen House" || name === "Water Well") {
    const stateCopy = cloneDeep(gameState);
    const buildingGroup = stateCopy.buildings[name];

    if (!buildingGroup) {
      return false;
    }

    const buildingToRemove = buildingGroup.find(
      (building) => building.id === placeableId
    );

    if (!buildingToRemove) {
      return false;
    }

    stateCopy.buildings[name] = buildingGroup.filter(
      (building) => building.id !== buildingToRemove.id
    );

    if (name === "Hen House") {
      return !areUnsupportedChickensBrewing(stateCopy);
    }

    const { hasUnsupportedCrops } = removeUnsupportedCrops(stateCopy);
    return !hasUnsupportedCrops;
  }

  if (name === "Chicken Coop") {
    const stateCopy = cloneDeep(gameState);
    const collectibleGroup = stateCopy.collectibles[name];

    if (!collectibleGroup) {
      return false;
    }

    const collectibleToRemove = collectibleGroup.find(
      (collectible) => collectible.id === placeableId
    );

    if (!collectibleToRemove) {
      return false;
    }

    stateCopy.collectibles[name] = collectibleGroup.filter(
      (collectible) => collectible.id !== collectibleToRemove.id
    );

    return !areUnsupportedChickensBrewing(stateCopy);
  }

  if (
    name === "Tree" ||
    name === "Stone Rock" ||
    name === "Iron Rock" ||
    name === "Gold Rock" ||
    name === "Fruit Patch"
  ) {
    return false;
  }

  return true;
};
