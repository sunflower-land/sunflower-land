import { produce } from "immer";
import {
  type CollectibleName,
  COLLECTIBLES_DIMENSIONS,
} from "../../types/craftables";
import type { GameState } from "features/game/types/game";
import { getObjectEntries } from "lib/object";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { INTERIOR_CANVAS } from "features/game/expansion/placeable/lib/interiorLayouts";

/** The two interior surfaces an old-home item can be imported onto, tried in
 *  order: the ground floor first, then the upstairs floor (if unlocked). */
const IMPORT_LOCATIONS = ["interior", "level_one"] as const;
export type ImportLocation = (typeof IMPORT_LOCATIONS)[number];

export type ImportPlacement = {
  name: CollectibleName;
  id: string;
  location: ImportLocation;
  coordinates: { x: number; y: number };
};

export type HomeImportPlan = {
  /** Items that found a spot, with the floor + coordinates they'll land on. */
  placements: ImportPlacement[];
  /** Items that had nowhere to go and will stay in the old home. */
  unplaced: Array<{ name: CollectibleName; id: string }>;
  /** Total number of placed old-home items considered. */
  total: number;
};

/**
 * Scans a single interior floor for the first non-colliding spot that fits an
 * item of the given name.
 *
 * Order is top-left reading order: top row first (back wall), left → right,
 * working down toward the entrance. Coordinates are returned in the same
 * canvas-centred ("placeable") space the rest of the placement system uses —
 * `detectCollision` translates them to the bottom-left layout grid internally
 * and validates both the floor tiles and overlap with existing items.
 */
function findInteriorSpot(
  state: GameState,
  name: CollectibleName,
  location: ImportLocation,
): { x: number; y: number } | undefined {
  const dimensions = COLLECTIBLES_DIMENSIONS[name];
  if (!dimensions) return undefined;

  const { width, height } = dimensions;
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

/** Pushes a minimal placed item onto a floor so subsequent scans treat the
 *  spot as occupied. Used while building the plan on a scratch draft. */
function markOccupied(state: GameState, placement: ImportPlacement): void {
  const collectibles =
    placement.location === "interior"
      ? state.interior.ground.collectibles
      : state.interior.level_one?.collectibles;

  if (!collectibles) return;

  const items = (collectibles[placement.name] ??= []);
  items.push({ id: placement.id, coordinates: placement.coordinates });
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
 * dispatches a `collectible.removed` (dig up) + `collectible.placed` pair per
 * placement so the import reuses the existing, server-recognised events instead
 * of a bespoke reducer. See `ImportHomeButton`.
 */
export function getHomeImportPlan(state: GameState): HomeImportPlan {
  const homeItems: Array<{ name: CollectibleName; id: string }> = [];
  getObjectEntries(state.home.collectibles).forEach(([name, items]) => {
    (items ?? []).forEach((item) => {
      if (item.coordinates) homeItems.push({ name, id: item.id });
    });
  });

  const placements: ImportPlacement[] = [];
  const unplaced: Array<{ name: CollectibleName; id: string }> = [];

  produce(state, (draft) => {
    for (const { name, id } of homeItems) {
      let placement: ImportPlacement | undefined;

      for (const location of IMPORT_LOCATIONS) {
        // Upstairs only exists once the first interior upgrade is bought.
        if (location === "level_one" && !draft.interior.level_one) continue;

        const spot = findInteriorSpot(draft, name, location);
        if (spot) {
          placement = { name, id, location, coordinates: spot };
          break;
        }
      }

      if (placement) {
        placements.push(placement);
        markOccupied(draft, placement);
      } else {
        unplaced.push({ name, id });
      }
    }
  });

  return { placements, unplaced, total: homeItems.length };
}
