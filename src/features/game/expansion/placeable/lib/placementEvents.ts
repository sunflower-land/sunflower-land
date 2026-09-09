/**
 * What the landscaping machine sends to the game machine when the player drops
 * something. Kept out of landscapingMachine.ts so it can be unit-tested: that
 * module pulls in the game machine (and through it the wallet) and cannot be
 * loaded under jest.
 */

import { v4 as uuidv4 } from "uuid";
import { LIVE_LANDSCAPING_EVENTS } from "features/game/lib/landscapingDraft";
import type { GameEventName, PlacementEvent } from "features/game/events";
import {
  BUILDINGS_DIMENSIONS,
  type BuildingName,
} from "features/game/types/buildings";
import type { CollectibleName } from "features/game/types/craftables";
import { RESOURCES, type ResourceName } from "features/game/types/resources";
import type { Coordinates } from "../../components/MapPlacement";
import type { PlaceableLocation } from "features/game/types/collectibles";
import type { NFTName } from "features/game/events/landExpansion/placeNFT";

export const RESOURCE_PLACE_EVENTS: Record<
  Exclude<ResourceName, "Boulder">,
  GameEventName<PlacementEvent>
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
  "Ascension Crystal": "ascensionCrystal.placed",
};

export type LandscapingPlaceable =
  | BuildingName
  | CollectibleName
  | ResourceName
  | NFTName
  | "FarmHand"
  | "Bumpkin";

export type LandscapingPlaceableType =
  | {
      name: NFTName | "FarmHand" | "Bumpkin";
      id: string;
    }
  | {
      name: BuildingName | CollectibleName | ResourceName;
      id?: string;
    };

/**
 * Resolves a (placeable, location) pair to the action name to dispatch.
 *
 * No special-casing for `interior` / `level_one` — they reuse the same
 * `collectible.placed` / `building.placed` / resource-specific paths as
 * `home` / `farm`. Resources and buildings shouldn't reach the interior
 * chest UI in the first place; if they somehow did, they'd route through
 * the same code as on the farm.
 */
export function placeEvent(
  name: LandscapingPlaceable,
  _location?: PlaceableLocation,
): GameEventName<PlacementEvent> {
  if (name in RESOURCES) {
    return RESOURCE_PLACE_EVENTS[
      name as Exclude<ResourceName, "Boulder">
    ] as GameEventName<PlacementEvent>;
  }

  if (name in BUILDINGS_DIMENSIONS) {
    return "building.placed";
  }

  return "collectible.placed";
}

/** The slice of the landscaping machine's context a placement is built from. */
export type PlacementContext = {
  action?: GameEventName<PlacementEvent>;
  coordinates: Coordinates;
  placeable?: LandscapingPlaceableType;
  sandbox?: boolean;
};

/**
 * The event that settles a PLACE: what the player just dropped, at the tile
 * they dropped it on.
 *
 * Purchases are the exception in the sandbox. They are real transactions that
 * must survive Cancel, so they settle live WITHOUT coordinates - the item
 * lands in the chest - and `draftPlacementEvent` follows with the placement as
 * a draft edit. Buds, Pets, Bumpkins and farm hands are already-owned
 * instances and carry their own id rather than a fresh one.
 */
export const settlePlacementEvent = (
  { placeable, action, sandbox, coordinates: { x, y } }: PlacementContext,
  location: PlaceableLocation,
): PlacementEvent => {
  if (placeable?.name === "Bud" || placeable?.name === "Pet") {
    return {
      type: action,
      coordinates: { x, y },
      id: placeable?.id,
      nft: placeable?.name,
      location,
    } as PlacementEvent;
  }

  if (placeable?.name === "Bumpkin") {
    return {
      type: action,
      coordinates: { x, y },
      location,
    } as PlacementEvent;
  }

  if (placeable?.name === "FarmHand" && placeable?.id) {
    return {
      type: action,
      coordinates: { x, y },
      id: placeable.id,
      location,
    } as PlacementEvent;
  }

  const id = uuidv4().slice(0, 8);

  if (sandbox && LIVE_LANDSCAPING_EVENTS.has(action as string)) {
    return {
      type: action,
      name: placeable?.name,
      id,
      location,
    } as PlacementEvent;
  }

  return {
    type: action,
    name: placeable?.name,
    coordinates: { x, y },
    id,
    location,
  } as PlacementEvent;
};

/** True when `settlePlacementEvent` left the item in the chest. */
export const needsDraftPlacement = ({
  placeable,
  action,
  sandbox,
}: PlacementContext) =>
  !!sandbox &&
  !!placeable?.name &&
  LIVE_LANDSCAPING_EVENTS.has(action as string);

/**
 * The draft placement that follows a live purchase. The parent processes
 * events in order, so the item is already in the chest when this runs.
 */
export const draftPlacementEvent = (
  { placeable, coordinates: { x, y } }: PlacementContext,
  location: PlaceableLocation,
): PlacementEvent =>
  ({
    type: placeEvent(placeable!.name as LandscapingPlaceable, location),
    name: placeable!.name,
    coordinates: { x, y },
    id: uuidv4().slice(0, 8),
    location,
  }) as PlacementEvent;
