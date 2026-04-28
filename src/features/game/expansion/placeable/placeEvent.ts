import { GameEventName, PlacementEvent } from "features/game/events";
import {
  BUILDINGS_DIMENSIONS,
  BuildingName,
} from "features/game/types/buildings";
import {
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "features/game/types/craftables";
import { PlaceableLocation } from "features/game/types/collectibles";
import { RESOURCES, ResourceName } from "features/game/types/resources";
import { NFTName } from "features/game/events/landExpansion/placeNFT";

export type LandscapingPlaceable =
  | BuildingName
  | CollectibleName
  | ResourceName
  | NFTName
  | "FarmHand"
  | "Bumpkin";

export const RESOURCE_PLACE_EVENTS: Partial<
  Record<ResourceName, GameEventName<PlacementEvent>>
> = {
  Tree: "tree.placed",
  "Ancient Tree": "tree.placed",
  "Sacred Tree": "tree.placed",
  "Stone Rock": "stone.placed",
  "Fused Stone Rock": "stone.placed",
  "Reinforced Stone Rock": "stone.placed",
  "Iron Rock": "iron.placed",
  "Refined Iron Rock": "iron.placed",
  "Tempered Iron Rock": "iron.placed",
  "Gold Rock": "gold.placed",
  "Pure Gold Rock": "gold.placed",
  "Prime Gold Rock": "gold.placed",
  "Crimstone Rock": "crimstone.placed",
  "Crop Plot": "plot.placed",
  "Fruit Patch": "fruitPatch.placed",
  Beehive: "beehive.placed",
  "Flower Bed": "flowerBed.placed",
  "Sunstone Rock": "sunstone.placed",
  "Oil Reserve": "oilReserve.placed",
  "Lava Pit": "lavaPit.placed",
};

/**
 * Pure routing helper used by the landscaping machine to translate a
 * (placeable, location) pair into the action name to dispatch.
 *
 * Lives in its own module (not landscapingMachine.ts) so it can be unit-tested
 * without dragging in xstate and the auth/wallet machinery that landscapingMachine
 * pulls in transitively via gameMachine.
 *
 * Interior surfaces (`interior`, `level_one`) follow the same constraints as
 * `/home` — only collectibles can be placed. Resources and buildings live on
 * the farm; attempting to place either inside an interior throws.
 */
export function placeEvent(
  name: LandscapingPlaceable,
  location?: PlaceableLocation,
): GameEventName<PlacementEvent> {
  const isInteriorLocation =
    location === "interior" || location === "level_one";

  if (isInteriorLocation && name in RESOURCES) {
    throw new Error(`${name} cannot be placed inside the interior`);
  }
  if (isInteriorLocation && name in BUILDINGS_DIMENSIONS) {
    throw new Error(`${name} cannot be placed inside the interior`);
  }

  if (name in RESOURCES) {
    return RESOURCE_PLACE_EVENTS[
      name as ResourceName
    ] as GameEventName<PlacementEvent>;
  }

  if (name in BUILDINGS_DIMENSIONS) {
    return "building.placed";
  }

  // Defensive fall-through: silence the unused-import warning when stripping
  // collectibles down the road.
  void COLLECTIBLES_DIMENSIONS;
  return "collectible.placed";
}
