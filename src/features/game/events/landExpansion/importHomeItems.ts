import { produce } from "immer";
import {
  type CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "../../types/craftables";
import type { GameState } from "features/game/types/game";
import { getObjectEntries } from "lib/object";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { INTERIOR_CANVAS } from "features/game/expansion/placeable/lib/interiorLayouts";
import { PET_NFT_DIMENSIONS } from "features/game/types/pets";
import type { LandscapingPlaceable } from "features/game/expansion/placeable/landscapingMachine";
import type { PlacementEvent } from "../index";
import { removeCollectible } from "./removeCollectible";
import { placeCollectible } from "./placeCollectible";
import { removeBumpkinPlacement } from "./removeBumpkinPlacement";
import { placeBumpkin } from "./placeBumpkin";
import { removeFarmHand } from "./removeFarmHand";
import { placeFarmHand } from "./placeFarmHand";
import { removeNFT } from "./removeNFT";
import { placeNFT, type NFTName } from "./placeNFT";

/** The two interior surfaces an old-home item can be imported onto, tried in
 *  order: the ground floor first, then the upstairs floor (if unlocked). */
const IMPORT_LOCATIONS = ["interior", "level_one"] as const;
export type ImportLocation = (typeof IMPORT_LOCATIONS)[number];

/**
 * The kinds of placed item the old `home` can hold, each of which moves with its
 * own event:
 *  - `collectible` → `collectible.moved`
 *  - `bumpkin`     → `bumpkin.moved`
 *  - `farmHand`    → `farmHand.moved`
 *  - `bud`/`petNFT`→ `nft.moved`
 */
export type ImportItemKind =
  | "collectible"
  | "bumpkin"
  | "farmHand"
  | "bud"
  | "petNFT";

/** A single placed old-home item, normalised so the planner can treat every
 *  kind the same way (find a spot, mark it occupied). */
export type ImportItem = {
  kind: ImportItemKind;
  /** Name used for collision/dimension lookups and display. */
  name: LandscapingPlaceable;
  /** Identifier the move event needs. The single bumpkin has none. */
  id?: string;
  width: number;
  height: number;
};

export type ImportPlacement = {
  item: ImportItem;
  location: ImportLocation;
  coordinates: { x: number; y: number };
};

export type HomeImportPlan = {
  /** Items that found a spot, with the floor + coordinates they'll land on. */
  placements: ImportPlacement[];
  /** Items that had nowhere to go and will stay in the old home. */
  unplaced: ImportItem[];
  /** Total number of placed old-home items considered. */
  total: number;
};

/**
 * Collects every placed item still sitting in the old `home`, normalised into a
 * single {@link ImportItem} list. Covers all five placeable kinds: collectibles
 * (stored in `home.collectibles`) plus the bumpkin, farm hands, buds and pet
 * NFTs, which live globally but carry a `location: "home"` flag.
 */
export function getHomeItems(state: GameState): ImportItem[] {
  const items: ImportItem[] = [];

  getObjectEntries(state.home.collectibles).forEach(([name, placed]) => {
    const dimensions = COLLECTIBLES_DIMENSIONS[name];
    if (!dimensions) return;
    (placed ?? []).forEach((item) => {
      if (!item.coordinates) return;
      items.push({
        kind: "collectible",
        name,
        id: item.id,
        width: dimensions.width,
        height: dimensions.height,
      });
    });
  });

  if (state.bumpkin?.coordinates && state.bumpkin.location === "home") {
    items.push({ kind: "bumpkin", name: "Bumpkin", width: 1, height: 1 });
  }

  Object.entries(state.farmHands.bumpkins ?? {}).forEach(([id, farmHand]) => {
    if (farmHand.coordinates && farmHand.location === "home") {
      items.push({
        kind: "farmHand",
        name: "FarmHand",
        id,
        width: 1,
        height: 1,
      });
    }
  });

  Object.entries(state.buds ?? {}).forEach(([id, bud]) => {
    if (bud.coordinates && bud.location === "home") {
      items.push({ kind: "bud", name: "Bud", id, width: 1, height: 1 });
    }
  });

  Object.entries(state.pets?.nfts ?? {}).forEach(([id, nft]) => {
    if (nft.coordinates && nft.location === "home") {
      items.push({
        kind: "petNFT",
        name: "Pet",
        id,
        width: PET_NFT_DIMENSIONS.width,
        height: PET_NFT_DIMENSIONS.height,
      });
    }
  });

  return items;
}

/** True when the old home still holds any placed item of any kind. Cheaper than
 *  building the full plan; used to gate the import button / welcome prompt. */
export function hasHomeItemsToImport(state: GameState): boolean {
  return getHomeItems(state).length > 0;
}

/**
 * Scans a single interior floor for the first non-colliding spot that fits an
 * item of the given size.
 *
 * Order is top-left reading order: top row first (back wall), left → right,
 * working down toward the entrance. Coordinates are returned in the same
 * canvas-centred ("placeable") space the rest of the placement system uses —
 * `detectCollision` translates them to the bottom-left layout grid internally
 * and validates both the floor tiles and overlap with existing items.
 */
function findInteriorSpot(
  state: GameState,
  item: ImportItem,
  location: ImportLocation,
): { x: number; y: number } | undefined {
  const { width, height, name } = item;
  const halfWidth = INTERIOR_CANVAS.width / 2;
  const halfHeight = INTERIOR_CANVAS.height / 2;

  // Layout grid: x ∈ [0, width-1], y ∈ [1, height] (y identifies the top row).
  for (let yLayout = INTERIOR_CANVAS.height; yLayout >= 1; yLayout--) {
    for (let xLayout = 0; xLayout < INTERIOR_CANVAS.width; xLayout++) {
      const position = {
        x: xLayout - halfWidth,
        y: yLayout - halfHeight,
        width,
        height,
      };

      const collision = detectCollision({ state, position, location, name });
      if (!collision) {
        return { x: position.x, y: position.y };
      }
    }
  }

  return undefined;
}

/** Applies a planned placement to the scratch draft so subsequent scans treat
 *  the spot as occupied. Mirrors what the real move events do to live state. */
function markOccupied(state: GameState, placement: ImportPlacement): void {
  const { item, location, coordinates } = placement;

  switch (item.kind) {
    case "collectible": {
      const collectibles =
        location === "interior"
          ? state.interior.ground.collectibles
          : state.interior.level_one?.collectibles;
      if (!collectibles) return;
      (collectibles[item.name as CollectibleName] ??= []).push({
        id: item.id as string,
        coordinates,
      });
      break;
    }
    case "bumpkin":
      if (state.bumpkin) {
        state.bumpkin.coordinates = coordinates;
        state.bumpkin.location = location;
      }
      break;
    case "farmHand": {
      const farmHand = state.farmHands.bumpkins[item.id as string];
      if (farmHand) {
        farmHand.coordinates = coordinates;
        farmHand.location = location;
      }
      break;
    }
    case "bud": {
      const bud = state.buds?.[Number(item.id)];
      if (bud) {
        bud.coordinates = coordinates;
        bud.location = location;
      }
      break;
    }
    case "petNFT": {
      const nft = state.pets?.nfts?.[Number(item.id)];
      if (nft) {
        nft.coordinates = coordinates;
        nft.location = location;
      }
      break;
    }
  }
}

/**
 * Works out where every placed item in the old `home` would land if instantly
 * imported into the new interior. Items are placed one-by-one onto the ground
 * floor, falling through to level_one (when unlocked) only once the ground
 * floor can't fit them. Each assigned spot is marked occupied so later items
 * don't stack on top of earlier ones.
 *
 * Pure — it works on an immer scratch draft and never mutates `state`. Shared
 * by the import modal (for the "won't fit" count) and the apply loop, which
 * runs each placement through {@link tryApplyImportStep}. See `useHomeImport`.
 */
export function getHomeImportPlan(state: GameState): HomeImportPlan {
  const homeItems = getHomeItems(state);

  const placements: ImportPlacement[] = [];
  const unplaced: ImportItem[] = [];

  produce(state, (draft) => {
    for (const item of homeItems) {
      let placement: ImportPlacement | undefined;

      for (const location of IMPORT_LOCATIONS) {
        // Upstairs only exists once the first interior upgrade is bought.
        if (location === "level_one" && !draft.interior.level_one) continue;

        const spot = findInteriorSpot(draft, item, location);
        if (spot) {
          placement = { item, location, coordinates: spot };
          break;
        }
      }

      if (placement) {
        placements.push(placement);
        markOccupied(draft, placement);
      } else {
        unplaced.push(item);
      }
    }
  });

  return { placements, unplaced, total: homeItems.length };
}

/** The dig-up + place-down event pair that relocates a single planned item, plus
 *  a pure `apply` that runs both reducers in order (throwing if the place step is
 *  impossible). One descriptor per placeable kind — all reuse the existing,
 *  server-recognised remove/place events; nothing here is a new game event. */
type ImportStep = {
  events: PlacementEvent[];
  apply: (state: GameState) => GameState;
};

function getImportStep({
  item,
  location,
  coordinates,
}: ImportPlacement): ImportStep {
  switch (item.kind) {
    case "bumpkin": {
      const remove = {
        type: "bumpkin.removedPlacement" as const,
        location: "home" as const,
      };
      const place = { type: "bumpkin.placed" as const, coordinates, location };
      return {
        events: [remove, place],
        apply: (state) =>
          placeBumpkin({
            state: removeBumpkinPlacement({ state, action: remove }),
            action: place,
          }),
      };
    }
    case "farmHand": {
      const id = item.id as string;
      const remove = {
        type: "farmHand.removed" as const,
        id,
        location: "home" as const,
      };
      const place = {
        type: "farmHand.placed" as const,
        id,
        coordinates,
        location,
      };
      return {
        events: [remove, place],
        apply: (state) =>
          placeFarmHand({
            state: removeFarmHand({ state, action: remove }),
            action: place,
          }),
      };
    }
    case "bud":
    case "petNFT": {
      const nft: NFTName = item.kind === "bud" ? "Bud" : "Pet";
      const id = item.id as string;
      const remove = {
        type: "nft.removed" as const,
        nft,
        id,
        location: "home" as const,
      };
      const place = {
        type: "nft.placed" as const,
        nft,
        id,
        coordinates,
        location,
      };
      return {
        events: [remove, place],
        apply: (state) =>
          placeNFT({
            state: removeNFT({ state, action: remove }),
            action: place,
          }),
      };
    }
    case "collectible":
    default: {
      const name = item.name as CollectibleName;
      const id = item.id as string;
      const remove = {
        type: "collectible.removed" as const,
        name,
        id,
        location: "home" as const,
      };
      const place = {
        type: "collectible.placed" as const,
        name,
        id,
        coordinates,
        location,
      };
      return {
        events: [remove, place],
        apply: (state) =>
          placeCollectible({
            state: removeCollectible({ state, action: remove }),
            action: place,
          }),
      };
    }
  }
}

/**
 * Dig-up events for every item still placed in the old home — the same
 * `*.removed` events the import uses, which hand each item back to the player's
 * inventory. Used to clear out whatever the import couldn't move.
 *
 * Reuses {@link getImportStep} for the event shapes rather than repeating the
 * per-kind literals; the destination passed here only shapes the place event,
 * which is discarded.
 */
export function getHomeRemovalEvents(state: GameState): PlacementEvent[] {
  return getHomeItems(state).map(
    (item) =>
      getImportStep({ item, location: "interior", coordinates: { x: 0, y: 0 } })
        .events[0],
  );
}

/**
 * Attempts to relocate one planned item by digging it up and placing it down in
 * a single step, applied purely to `state`. Returns the resulting state plus the
 * two events to dispatch — or `null` if the item can't be placed, in which case
 * nothing changed and the item should be left untouched in the old home.
 *
 * This is the safety net behind the migration: rather than firing the dig-up
 * event and hoping the place succeeds, we run both reducers up front and only
 * commit when the place actually lands, so an item is never dug up into the
 * inventory and stranded there.
 */
export function tryApplyImportStep(
  state: GameState,
  placement: ImportPlacement,
): { state: GameState; events: PlacementEvent[] } | null {
  const step = getImportStep(placement);
  try {
    return { state: step.apply(state), events: step.events };
  } catch {
    return null;
  }
}
