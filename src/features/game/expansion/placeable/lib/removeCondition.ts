import {
  areUnsupportedChickensBrewing,
  removeUnsupportedCrops,
} from "features/game/events/landExpansion/removeBuilding";
import { removeItem } from "features/game/events/landExpansion/utils";
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

    const buildingIndex = buildingGroup?.findIndex(
      (building) => building.id == placeableId
    );
    if (buildingIndex === -1) {
      return false;
    }

    stateCopy.buildings[name] = removeItem(
      buildingGroup,
      buildingGroup[buildingIndex]
    );

    if (name === "Hen House") return !areUnsupportedChickensBrewing(stateCopy);

    const { hasUnsupportedCrops } = removeUnsupportedCrops(stateCopy);
    return !hasUnsupportedCrops;
  }

  if (name === "Chicken Coop") {
    const stateCopy = cloneDeep(gameState);
    const collectibleGroup = stateCopy.collectibles[name];
    if (!collectibleGroup) {
      return false;
    }

    const buildingIndex = collectibleGroup?.findIndex(
      (collectible) => collectible.id == placeableId
    );
    if (buildingIndex === -1) {
      return false;
    }

    stateCopy.collectibles[name] = removeItem(
      collectibleGroup,
      collectibleGroup[buildingIndex]
    );
    return !areUnsupportedChickensBrewing(stateCopy);
  }

  return true;
};
