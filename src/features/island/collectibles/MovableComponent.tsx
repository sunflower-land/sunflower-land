import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";

import {
  COLLECTIBLES_DIMENSIONS,
  CollectibleName,
} from "features/game/types/craftables";

import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { Coordinates } from "features/game/expansion/components/MapPlacement";
import Draggable from "react-draggable";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { useSelector } from "@xstate/react";
import {
  LandscapingPlaceable,
  MachineInterpreter,
  MachineState,
} from "features/game/expansion/placeable/landscapingMachine";
import {
  BUILDINGS_DIMENSIONS,
  Dimensions,
} from "features/game/types/buildings";
import { GameEventName, PlacementEvent } from "features/game/events";
import { RESOURCES, ResourceName } from "features/game/types/resources";
import { GameState, PlacedItem } from "features/game/types/game";
import { removePlaceable } from "./lib/placing";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { isMobile } from "mobile-device-detect";
import { ZoomContext } from "components/ZoomProvider";
import { RemoveKuebikoModal } from "./RemoveKuebikoModal";
import { PlaceableLocation } from "features/game/types/collectibles";
import { RemoveHungryCaterpillarModal } from "./RemoveHungryCaterpillarModal";
import flipped from "assets/icons/flipped.webp";
import flipIcon from "assets/icons/flip.webp";
import pixelPerfectIcon from "assets/icons/pixel_perfect.webp";
import debounce from "lodash.debounce";
import { LIMITED_ITEMS } from "features/game/events/landExpansion/burnCollectible";
import { PET_SHRINES } from "features/game/types/pets";
import {
  EXPIRY_COOLDOWNS,
  TemporaryCollectibleName,
} from "features/game/lib/collectibleBuilt";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { getObjectEntries } from "lib/object";
import { getPetImage } from "../pets/lib/petShared";
import { useNow } from "lib/utils/hooks/useNow";
import { isPetCollectible } from "features/game/events/landExpansion/placeCollectible";
import { getBudImage } from "lib/buds/types";
import { hasFeatureAccess } from "lib/flags";

export const RESOURCE_MOVE_EVENTS: Record<
  ResourceName,
  GameEventName<PlacementEvent>
> = {
  Tree: "tree.moved",
  "Crop Plot": "crop.moved",
  "Fruit Patch": "fruitPatch.moved",
  "Gold Rock": "gold.moved",
  "Iron Rock": "iron.moved",
  "Stone Rock": "stone.moved",
  "Fused Stone Rock": "stone.moved",
  "Reinforced Stone Rock": "stone.moved",
  "Crimstone Rock": "crimstone.moved",
  Boulder: "tree.moved",
  Beehive: "beehive.moved",
  "Flower Bed": "flowerBed.moved",
  "Sunstone Rock": "sunstone.moved",
  "Oil Reserve": "oilReserve.moved",
  "Lava Pit": "lavaPit.moved",
  "Ancient Tree": "tree.moved",
  "Sacred Tree": "tree.moved",
  "Refined Iron Rock": "iron.moved",
  "Tempered Iron Rock": "iron.moved",
  "Pure Gold Rock": "gold.moved",
  "Prime Gold Rock": "gold.moved",
};

function getMoveAction(
  name: LandscapingPlaceable,
): GameEventName<PlacementEvent> {
  if (name in BUILDINGS_DIMENSIONS) {
    return "building.moved";
  }

  if (name in RESOURCES) {
    return RESOURCE_MOVE_EVENTS[name as ResourceName];
  }

  if (name in COLLECTIBLES_DIMENSIONS) {
    return "collectible.moved";
  }

  if (name === "Bud" || name === "Pet") {
    return "nft.moved";
  }

  if (name === "FarmHand") {
    return "farmHand.moved";
  }

  if (name === "Bumpkin") {
    return "bumpkin.moved";
  }

  throw new Error("No matching move event");
}

export const RESOURCES_REMOVE_ACTIONS: Record<
  Exclude<ResourceName, "Boulder">,
  GameEventName<PlacementEvent>
> = {
  Tree: "tree.removed",
  "Crop Plot": "plot.removed",
  "Fruit Patch": "fruitPatch.removed",
  "Gold Rock": "gold.removed",
  "Iron Rock": "iron.removed",
  "Stone Rock": "stone.removed",
  "Fused Stone Rock": "stone.removed",
  "Reinforced Stone Rock": "stone.removed",
  "Crimstone Rock": "crimstone.removed",
  Beehive: "beehive.removed",
  "Flower Bed": "flowerBed.removed",
  "Sunstone Rock": "sunstone.removed",
  "Oil Reserve": "oilReserve.removed",
  "Lava Pit": "lavaPit.removed",
  "Ancient Tree": "tree.removed",
  "Sacred Tree": "tree.removed",
  "Refined Iron Rock": "iron.removed",
  "Tempered Iron Rock": "iron.removed",
  "Pure Gold Rock": "gold.removed",
  "Prime Gold Rock": "gold.removed",
};

function getOverlappingCollectibles({
  state,
  x,
  y,
  location,
  current,
}: {
  state: GameState;
  x: number;
  y: number;
  location: PlaceableLocation;
  current: { id: string; name: LandscapingPlaceable };
}): { id: string; name: LandscapingPlaceable }[] {
  const source =
    location === "home"
      ? state.home.collectibles
      : location === "petHouse"
        ? state.petHouse.pets
        : state.collectibles;
  const results: { id: string; name: LandscapingPlaceable }[] = [];

  getObjectEntries(source).forEach(([name, placed]) => {
    (placed ?? []).forEach((p) => {
      if (!p.coordinates) return;
      if (p.coordinates.x === x && p.coordinates.y === y) {
        results.push({ id: p.id, name });
      }
    });
  });

  // Ensure the currently clicked item is included as an option
  const hasCurrent = results.some((r) => r.id === current.id);
  if (!hasCurrent) {
    results.unshift(current);
  }

  return results;
}

export function getRemoveAction(
  name: LandscapingPlaceable | undefined,
  now: number,
  collectible?: PlacedItem,
): GameEventName<PlacementEvent> | null {
  if (!name) {
    return null;
  }

  if (
    name in BUILDINGS_DIMENSIONS &&
    name !== "Manor" &&
    name !== "Town Center" &&
    name !== "House" &&
    name !== "Mansion"
  ) {
    return "building.removed";
  }

  if (LIMITED_ITEMS.includes(name as CollectibleName)) {
    const isShrine = name in PET_SHRINES || name === "Obsidian Shrine";
    if (isShrine && collectible) {
      const cooldown = EXPIRY_COOLDOWNS[name as TemporaryCollectibleName];
      if (!cooldown || (collectible.createdAt ?? 0) + cooldown > now) {
        return null;
      }
      return "collectible.removed";
    }
    return null;
  }

  if (name in COLLECTIBLES_DIMENSIONS) {
    return "collectible.removed";
  }

  if (name === "Bud" || name === "Pet") {
    return "nft.removed";
  }

  if (name === "FarmHand") {
    return "farmHand.removed";
  }

  if (name === "Bumpkin") {
    return "bumpkin.removedPlacement";
  }

  if (name in RESOURCES_REMOVE_ACTIONS) {
    return RESOURCES_REMOVE_ACTIONS[name as Exclude<ResourceName, "Boulder">];
  }

  return null;
}

export const isCollectible = (
  name: LandscapingPlaceable,
): name is CollectibleName => name in COLLECTIBLES_DIMENSIONS;

export interface MovableProps {
  name: LandscapingPlaceable;
  id: string;
  index: number;
  x: number;
  y: number;
  location?: PlaceableLocation;
}

const getMovingItem = (state: MachineState) => state.context.moving;

const onDrag = ({
  data,
  coordinatesX,
  coordinatesY,
  detect,
  setIsDragging,
  setPosition,
  name,
  id,
  location,
  dimensions,
  setIsColliding,
  state,
}: {
  data: Coordinates;
  coordinatesX: number;
  coordinatesY: number;
  detect: (
    coordinates: Coordinates,
    state: GameState,
    name: LandscapingPlaceable,
    id: string,
    location: PlaceableLocation,
    dimensions: Dimensions,
    setIsColliding: (isColliding: boolean) => void,
  ) => void;
  setIsDragging: (isDragging: boolean) => void;
  setPosition: (position: Coordinates) => void;
  name: LandscapingPlaceable;
  id: string;
  location: PlaceableLocation;
  dimensions: Dimensions;
  setIsColliding: (isColliding: boolean) => void;
  state: GameState;
}) => {
  const xDiff = Math.round(data.x / GRID_WIDTH_PX);
  const yDiff = Math.round(-data.y / GRID_WIDTH_PX);

  const x = coordinatesX + xDiff;
  const y = coordinatesY + yDiff;
  detect({ x, y }, state, name, id, location, dimensions, setIsColliding);
  setIsDragging(true);

  setPosition({
    x: xDiff * GRID_WIDTH_PX,
    y: -yDiff * GRID_WIDTH_PX,
  });
};

const detect = (
  { x, y }: Coordinates,
  state: GameState,
  name: LandscapingPlaceable,
  id: string,
  location: PlaceableLocation,
  dimensions: Dimensions,
  setIsColliding: (isColliding: boolean) => void,
) => {
  const game = removePlaceable({
    state,
    id,
    name,
  });
  const collisionDetected = detectCollision({
    name,
    state: game,
    location,
    position: { x, y, ...dimensions },
  });

  setIsColliding(collisionDetected);
  // send({ type: "UPDATE", coordinates: { x, y }, collisionDetected });
};

// Keep track of the only one overlap menu open across all MoveableComponent instances
let closeCurrentOverlapMenu: (() => void) | null = null;

export const getSelectedCollectible =
  (
    name: LandscapingPlaceable | undefined,
    id: string | undefined,
    location: PlaceableLocation,
  ) =>
  (state: GameMachineState) => {
    if (!name || !isCollectible(name)) return undefined;
    return (
      location === "home"
        ? state.context.state.home.collectibles[name]
        : location === "petHouse" && isPetCollectible(name)
          ? state.context.state.petHouse.pets[name]
          : state.context.state.collectibles[name]
    )?.find((collectible) => collectible.id === id);
  };

export const MoveableComponent: React.FC<
  React.PropsWithChildren<MovableProps>
> = ({
  name,
  id,
  x: coordinatesX,
  y: coordinatesY,
  children,
  location = "farm",
}) => {
  const { scale } = useContext(ZoomContext);

  const nodeRef = useRef<HTMLDivElement>(null);

  const { gameService } = useContext(Context);
  const [isColliding, setIsColliding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [counts, setCounts] = useState(0);
  const [position, setPosition] = useState<Coordinates>({
    x: 0,
    y: 0,
  });

  const isActive = useRef(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [showOverlapMenu, setShowOverlapMenu] = useState(false);

  // Pixel-perfect adjustment: lets the player nudge a placed item by integer
  // source pixels. 1 click = 1 unit = 1 source pixel = PIXEL_SCALE screen pixels.
  // Total offset (savedOX/oY + in-session pixelDelta) is clamped to ±8 source
  // pixels (half a tile) per axis. pixelDelta tracks the in-session change; on
  // commit it is dispatched as oX/oY on the saved coordinates. The integer x/y
  // of the saved coordinates never change, so collision, AOE, and any
  // tile-keyed comparison keep working unchanged.
  const PIXEL_PERFECT_STEP = 1;
  const PIXEL_PERFECT_MAX = 8;
  const [isPixelPerfectMode, setIsPixelPerfectMode] = useState(false);
  const [pixelDelta, setPixelDelta] = useState<Coordinates>({ x: 0, y: 0 });
  // Mirror pixelDelta into a ref so the deselect effect — which intentionally
  // does not list pixelDelta in its deps — always reads the latest value
  // when it fires, regardless of effect closure timing.
  const pixelDeltaRef = useRef<Coordinates>({ x: 0, y: 0 });
  pixelDeltaRef.current = pixelDelta;
  const [overlapChoices, setOverlapChoices] = useState<
    { id: string; name: LandscapingPlaceable }[]
  >([]);
  const overlapRef = useRef<HTMLDivElement>(null);
  const skipNextOutsideClick = useRef(false);
  const suppressNextMenuOpen = useRef(false);
  const localCloserRef = useRef<() => void>(() => {});
  const dragStartChecked = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (closeCurrentOverlapMenu === localCloserRef.current) {
        closeCurrentOverlapMenu = null;
      }
    };
  }, []);

  // Close overlap menu when clicking outside
  useEffect(() => {
    if (!showOverlapMenu) return;

    const onDocMouseDown = (e: MouseEvent) => {
      if (skipNextOutsideClick.current) {
        skipNextOutsideClick.current = false;
        return;
      }
      if (!overlapRef.current) return;
      const target = e.target as Node;
      if (!overlapRef.current.contains(target)) {
        setShowOverlapMenu(false);
        dragStartChecked.current = false;
        if (closeCurrentOverlapMenu === localCloserRef.current) {
          closeCurrentOverlapMenu = null;
        }
      }
    };

    // Defer listener to the next tick so the opening mousedown doesn't close it immediately
    const id = setTimeout(() => {
      document.addEventListener("mousedown", onDocMouseDown);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, [showOverlapMenu]);

  const landscapingMachine = gameService.getSnapshot().children
    .landscaping as MachineInterpreter;

  const movingItem = useSelector(landscapingMachine, getMovingItem);

  const isPlacing = useSelector(landscapingMachine, (state) =>
    state.matches({ editing: "placing" }),
  );

  const isSelected = movingItem?.id === id && movingItem?.name === name;

  const selectedCollectible = useSelector(
    gameService,
    getSelectedCollectible(name, id, location),
  );

  // Pull the saved sub-tile offset for this entity. Read directly from game
  // state so we don't have to thread oX/oY through every wrapper (Collectible,
  // Building, Resource, Bud, PetNFT, FarmHand, PlacedBumpkin) and renderer.
  // x/y stay as integer tiles; oX/oY is the rendering-only offset (integer
  // source pixels, range -8..8) set by pixel-perfect mode.
  const { savedOX, savedOY } = useSelector(gameService, (state) => {
    const ctx = state.context.state;

    // Helper to extract { oX, oY } from a coordinates-like object.
    const offsetOf = (
      c: { oX?: number; oY?: number } | undefined,
    ): { savedOX: number; savedOY: number } => ({
      savedOX: c?.oX ?? 0,
      savedOY: c?.oY ?? 0,
    });

    // Resources have flat oX/oY directly on the entity record.
    if (name in RESOURCES) {
      const lookups: Record<
        string,
        Record<string, { oX?: number; oY?: number }> | undefined
      > = {
        Tree: ctx.trees,
        "Ancient Tree": ctx.trees,
        "Sacred Tree": ctx.trees,
        Boulder: ctx.trees,
        "Crop Plot": ctx.crops,
        "Fruit Patch": ctx.fruitPatches,
        "Stone Rock": ctx.stones,
        "Fused Stone Rock": ctx.stones,
        "Reinforced Stone Rock": ctx.stones,
        "Iron Rock": ctx.iron,
        "Refined Iron Rock": ctx.iron,
        "Tempered Iron Rock": ctx.iron,
        "Gold Rock": ctx.gold,
        "Pure Gold Rock": ctx.gold,
        "Prime Gold Rock": ctx.gold,
        "Crimstone Rock": ctx.crimstones,
        "Sunstone Rock": ctx.sunstones,
        "Oil Reserve": ctx.oilReserves,
        "Lava Pit": ctx.lavaPits,
        Beehive: ctx.beehives,
        "Flower Bed": ctx.flowers.flowerBeds,
      };
      return offsetOf(lookups[name as string]?.[id]);
    }

    // Buildings — placed in the world only.
    if (name in BUILDINGS_DIMENSIONS) {
      const item = ctx.buildings[name as keyof typeof ctx.buildings]?.find(
        (b) => b.id === id,
      );
      return offsetOf(item?.coordinates);
    }

    // Collectibles — farm / home / pet house.
    if (name in COLLECTIBLES_DIMENSIONS) {
      const cName = name as CollectibleName;
      const collectibles =
        location === "home"
          ? ctx.home.collectibles[cName]
          : location === "petHouse" && isPetCollectible(cName)
            ? (ctx.petHouse.pets as Record<string, PlacedItem[] | undefined>)[
                cName
              ]
            : ctx.collectibles[cName];
      const item = collectibles?.find((c: PlacedItem) => c.id === id);
      return offsetOf(item?.coordinates);
    }

    if (name === "Bud") {
      return offsetOf(ctx.buds?.[Number(id)]?.coordinates);
    }
    if (name === "Pet") {
      return offsetOf(ctx.pets?.nfts?.[Number(id)]?.coordinates);
    }
    if (name === "FarmHand") {
      return offsetOf(ctx.farmHands?.bumpkins?.[id]?.coordinates);
    }
    if (name === "Bumpkin") {
      return offsetOf(ctx.bumpkin?.coordinates);
    }
    return { savedOX: 0, savedOY: 0 };
  });
  // Mirror saved offset into a ref for the deselect effect to read on commit
  // (avoids stale closure issues when effect deps don't include them).
  const savedOffsetRef = useRef({ savedOX: 0, savedOY: 0 });
  savedOffsetRef.current = { savedOX, savedOY };

  const isShrine = name in PET_SHRINES || name === "Obsidian Shrine";

  const now = useNow({ live: isShrine });

  const removeAction =
    !isMobile && getRemoveAction(name, now, selectedCollectible);

  const hasRemovalAction = !!removeAction;

  const hasFlipAction = !isMobile && isCollectible(name);

  const flip = () => {
    if (isCollectible(name)) {
      landscapingMachine.send("FLIP", { id, name, location });
    }
  };

  // Pixel-perfect mode is gated behind the PIXEL_PERFECT_PLACEMENT beta flag.
  // For launch, we only enable it on placeable "characters" — collectibles,
  // buds, pet NFTs, farm hands, and the player's bumpkin. Buildings and natural
  // resources (trees, crops, rocks, etc.) keep their existing tile-snap-only
  // behaviour. Mobile uses LandscapingHud for selection controls so we only
  // render the disc on non-mobile, matching flip/remove.
  const hasPixelPerfectFeature = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "PIXEL_PERFECT_PLACEMENT"),
  );
  const isPixelPerfectAllowedFor =
    name in COLLECTIBLES_DIMENSIONS ||
    name === "Bud" ||
    name === "Pet" ||
    name === "FarmHand" ||
    name === "Bumpkin";
  const hasPixelPerfectAction =
    !isMobile && hasPixelPerfectFeature && isPixelPerfectAllowedFor;

  const togglePixelPerfectMode = () => {
    setIsPixelPerfectMode((prev) => !prev);
  };

  // dx, dy are direction multipliers in {-1, 0, 1}. y is inverted on screen
  // (positive y in game coords = up visually) which matches the rest of this file.
  // pixelDelta tracks the in-session change relative to the saved oX/oY. The total
  // committed offset (savedOX + pixelDelta.x, savedOY + pixelDelta.y) must stay
  // within ±8 source pixels; we clamp pixelDelta accordingly.
  const movePixel = (dx: -1 | 0 | 1, dy: -1 | 0 | 1) => {
    setPixelDelta((prev) => {
      const clamp = (v: number, min: number, max: number) =>
        Math.min(Math.max(v, min), max);

      const newTotalX = clamp(
        savedOX + prev.x + dx * PIXEL_PERFECT_STEP,
        -PIXEL_PERFECT_MAX,
        PIXEL_PERFECT_MAX,
      );
      const newTotalY = clamp(
        savedOY + prev.y + dy * PIXEL_PERFECT_STEP,
        -PIXEL_PERFECT_MAX,
        PIXEL_PERFECT_MAX,
      );

      return {
        x: newTotalX - savedOX,
        y: newTotalY - savedOY,
      };
    });
  };

  const isFlipped = useSelector(gameService, (state) => {
    if (!isCollectible(name)) return false;
    const collectibles =
      location === "home"
        ? state.context.state.home.collectibles[name]
        : location === "petHouse" && isPetCollectible(name)
          ? state.context.state.petHouse.pets[name]
          : state.context.state.collectibles[name];
    return (
      collectibles?.find((collectible) => collectible.id === id)?.flipped ??
      false
    );
  });

  const remove = () => {
    if (!removeAction) {
      return;
    }

    if (showRemoveConfirmation) {
      landscapingMachine.send("REMOVE", {
        event: removeAction,
        id: id,
        name: name,
        location,
      });
    } else {
      setShowRemoveConfirmation(true);
    }
  };

  useEffect(() => {
    const delta = pixelDeltaRef.current;
    const saved = savedOffsetRef.current;

    // Commit the pixel-perfect offset (if any) whenever the item is
    // deselected, regardless of the isActive flag. pixelDelta is only ever
    // non-zero if the user actually interacted with the arrows, so it is a
    // sufficient proof of intent on its own. (The isActive guard remains for
    // the legacy reset path below, which clears overlay state from drag/flip.)
    if (!isSelected && (delta.x !== 0 || delta.y !== 0)) {
      const newOX = saved.savedOX + delta.x;
      const newOY = saved.savedOY + delta.y;

      gameService.send(getMoveAction(name), {
        ...(name in RESOURCE_MOVE_EVENTS
          ? {}
          : name === "Bud" || name === "Pet"
            ? { nft: name }
            : name === "FarmHand" || name === "Bumpkin"
              ? {}
              : { name }),
        coordinates: {
          x: coordinatesX,
          y: coordinatesY,
          oX: newOX,
          oY: newOY,
        },
        ...(name === "Bumpkin" ? {} : { id }),
        location: name in RESOURCE_MOVE_EVENTS ? undefined : location,
      });
      // NOTE: do NOT reset pixelDelta here. The transform on the rendered
      // entity is what's keeping it at the position the player chose. We
      // wait for the saved oX/oY to update (state machine processes the
      // move event), at which point the useLayoutEffect below resets
      // pixelDelta in the same paint frame — no flicker, save sticks.
    }

    if (isActive.current && !isSelected) {
      // Reset overlay state (used by drag/flip/remove discs).
      setCounts((prev) => prev + 1);
      setIsColliding(false);
      setShowRemoveConfirmation(false);
      setPosition({ x: 0, y: 0 });
      isActive.current = false;
      setIsPixelPerfectMode(false);
    }
  }, [
    isSelected,
    movingItem,
    coordinatesX,
    coordinatesY,
    gameService,
    id,
    location,
    name,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // When the saved coordinates (or their oX/oY offset) update — i.e. after a
  // successful move/pixel-perfect commit — zero out the in-session pixelDelta
  // so the live transform doesn't double up on the now-already-offset saved
  // coords. useLayoutEffect runs synchronously before paint so the user sees
  // the entity stay put rather than briefly jump.
  useLayoutEffect(() => {
    setPixelDelta((prev) =>
      prev.x === 0 && prev.y === 0 ? prev : { x: 0, y: 0 },
    );
  }, [coordinatesX, coordinatesY, savedOX, savedOY]);

  const DIMENSIONS_MAP: Record<LandscapingPlaceable, Dimensions> = {
    ...BUILDINGS_DIMENSIONS,
    ...COLLECTIBLES_DIMENSIONS,
    ...RESOURCE_DIMENSIONS,
    Bud: { width: 1, height: 1 },
    Pet: { width: 2, height: 2 },
    FarmHand: { width: 1, height: 1 },
    Bumpkin: { width: 1, height: 1 },
  };

  const dimensions = DIMENSIONS_MAP[name];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onStop = useCallback(
    debounce(
      ({
        data,
        coordinatesX,
        coordinatesY,
        id,
        name,
        location,
        dimensions,
      }: {
        data: Coordinates;
        coordinatesX: number;
        coordinatesY: number;
        id: string;
        name: LandscapingPlaceable;
        location: PlaceableLocation;
        dimensions: Dimensions;
      }) => {
        setIsDragging(false);

        const xDiff = Math.round(data.x / GRID_WIDTH_PX);
        const yDiff = Math.round(-data.y / GRID_WIDTH_PX);

        const x = coordinatesX + xDiff;
        const y = coordinatesY + yDiff;

        const hasMoved = x !== coordinatesX || y !== coordinatesY;
        if (!hasMoved) {
          return;
        }

        const game = removePlaceable({
          state: gameService.getSnapshot().context.state,
          id,
          name,
        });
        const collisionDetected = detectCollision({
          name,
          state: game,
          location,
          position: {
            x,
            y,
            width: dimensions.width,
            height: dimensions.height,
          },
        });

        if (!collisionDetected) {
          setPosition({ x: 0, y: 0 });
          gameService.send(getMoveAction(name), {
            // Don't send name for resource events and Bud events
            ...(name in RESOURCE_MOVE_EVENTS
              ? {}
              : name === "Bud" || name === "Pet"
                ? { nft: name }
                : name === "FarmHand" || name === "Bumpkin"
                  ? {}
                  : { name }),
            coordinates: { x, y },
            // Don't pass id for Bumpkin
            ...(name === "Bumpkin" ? {} : { id }),
            // Resources do not require location to be passed
            location: name in RESOURCE_MOVE_EVENTS ? undefined : location,
          });
        }
      },
      500,
      {
        leading: false,
        trailing: true,
      },
    ),
    [],
  );
  useEffect(() => {
    return () => {
      onStop.flush();
    };
  }, [onStop]);

  /**
   * Deselect if clicked outside of element
   */
  // https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isSelected &&
        (event as any).target.id === "genesisBlock" &&
        nodeRef.current &&
        !(nodeRef.current as any).contains(event.target)
      ) {
        landscapingMachine.send("BLUR");
        setPosition({ x: 0, y: 0 });
        onStop.flush();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
  }, [nodeRef, isSelected, landscapingMachine, onStop]);

  /**
   * While pixel-perfect mode is active, ANY click outside the component fully
   * deselects the item — not just clicks on the map's genesisBlock. This commits
   * the pending pixel offset (via the deselect effect above) and exits landscaping
   * focus so the player can resume editing other items normally.
   */
  useEffect(() => {
    if (!isPixelPerfectMode) return;

    function handlePixelPerfectClickOutside(event: MouseEvent) {
      if (
        nodeRef.current &&
        !(nodeRef.current as Node).contains(event.target as Node)
      ) {
        landscapingMachine.send("BLUR");
        setPosition({ x: 0, y: 0 });
        onStop.flush();
      }
    }

    document.addEventListener("mousedown", handlePixelPerfectClickOutside);
    return () => {
      document.removeEventListener("mousedown", handlePixelPerfectClickOutside);
    };
  }, [isPixelPerfectMode, landscapingMachine, onStop, name, id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Immediately return if in placing mode
      if (isPlacing) {
        return;
      }

      // While pixel-perfect mode is active, the four direction keys nudge by
      // one source pixel (1/16 tile) instead of jumping by a full tile. The
      // commit happens on deselect, same as clicking the on-screen arrows.
      if (isPixelPerfectMode) {
        if (e.key === "ArrowUp" || e.key === "w") {
          movePixel(0, 1);
          e.preventDefault();
        } else if (e.key === "ArrowDown" || e.key === "s") {
          movePixel(0, -1);
          e.preventDefault();
        } else if (e.key === "ArrowLeft" || e.key === "a") {
          movePixel(-1, 0);
          e.preventDefault();
        } else if (e.key === "ArrowRight" || e.key === "d") {
          movePixel(1, 0);
          e.preventDefault();
        }
        return;
      }

      if (e.key === "ArrowUp" || e.key === "w") {
        const newPosition = {
          x: position.x,
          y: position.y - GRID_WIDTH_PX,
        };
        onDrag({
          data: newPosition,
          coordinatesX,
          coordinatesY,
          detect,
          setIsDragging,
          setPosition,
          name,
          id,
          location,
          dimensions,
          state: gameService.getSnapshot().context.state,
          setIsColliding,
        });
        onStop({
          data: newPosition,
          coordinatesX,
          coordinatesY,
          id,
          name,
          location,
          dimensions,
        });
        e.preventDefault();
      } else if (e.key === "ArrowDown" || e.key === "s") {
        const newPosition = {
          x: position.x,
          y: position.y + GRID_WIDTH_PX,
        };
        onDrag({
          data: newPosition,
          coordinatesX,
          coordinatesY,
          detect,
          setIsDragging,
          setPosition,
          name,
          id,
          location,
          dimensions,
          state: gameService.getSnapshot().context.state,
          setIsColliding,
        });
        onStop({
          data: newPosition,
          coordinatesX,
          coordinatesY,
          id,
          name,
          location,
          dimensions,
        });
        e.preventDefault();
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        const newPosition = {
          x: position.x - GRID_WIDTH_PX,
          y: position.y,
        };
        onDrag({
          data: newPosition,
          coordinatesX,
          coordinatesY,
          detect,
          setIsDragging,
          setPosition,
          name,
          id,
          location,
          dimensions,
          state: gameService.getSnapshot().context.state,
          setIsColliding,
        });
        onStop({
          data: newPosition,
          coordinatesX,
          coordinatesY,
          id,
          name,
          location,
          dimensions,
        });
        e.preventDefault();
      } else if (e.key === "ArrowRight" || e.key === "d") {
        const newPosition = {
          x: position.x + GRID_WIDTH_PX,
          y: position.y,
        };
        onDrag({
          data: newPosition,
          coordinatesX,
          coordinatesY,
          detect,
          setIsDragging,
          setPosition,
          name,
          id,
          location,
          dimensions,
          state: gameService.getSnapshot().context.state,
          setIsColliding,
        });
        onStop({
          data: newPosition,
          coordinatesX,
          coordinatesY,
          id,
          name,
          location,
          dimensions,
        });
        e.preventDefault();
      }
    };
    if (isSelected) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    coordinatesX,
    coordinatesY,
    dimensions,
    gameService,
    id,
    isPlacing,
    isPixelPerfectMode,
    isSelected,
    location,
    name,
    onStop,
    position,
  ]);

  // Compute overlaps early for determining if we need live time updates
  const overlaps = getOverlappingCollectibles({
    state: gameService.getSnapshot().context.state,
    x: coordinatesX,
    y: coordinatesY,
    location,
    current: { id, name },
  });

  // Disable dragging if there are overlaps and this item is not selected
  const shouldDisableDrag = overlaps.length > 1 && !isSelected;

  return (
    <Draggable
      key={`${coordinatesX}-${coordinatesY}-${counts}`}
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      grid={[GRID_WIDTH_PX * scale.get(), GRID_WIDTH_PX * scale.get()]}
      scale={scale.get()}
      allowAnyClick
      // Mobile must click first, before dragging
      // Also disable if there are overlaps and this item isn't selected
      // Disable while pixel-perfect mode is active so on-screen arrows aren't fighting the drag
      disabled={
        (isMobile && !isSelected) || shouldDisableDrag || isPixelPerfectMode
      }
      onMouseDown={() => {
        // Mobile must click first, before dragging
        if (closeCurrentOverlapMenu) closeCurrentOverlapMenu();

        if (isMobile && !isActive.current) {
          isActive.current = true;

          return;
        }

        // Don't reopen the menu if an item was just chosen from the overlap menu
        if (suppressNextMenuOpen.current) {
          suppressNextMenuOpen.current = false;
          landscapingMachine.send("MOVE", { name, id });
          isActive.current = true;
          return;
        }

        // Show overlap menu if there are overlapping collectibles in the same coordinates
        if (overlaps.length > 1) {
          // Close any previously open overlap menu
          if (closeCurrentOverlapMenu) closeCurrentOverlapMenu();
          setTimeout(() => {
            if (!isDragging) {
              setOverlapChoices(overlaps);
              setShowOverlapMenu(true);
              skipNextOutsideClick.current = true;
              // Register this menu as the current one
              const closer = () => setShowOverlapMenu(false);
              localCloserRef.current = closer;
              closeCurrentOverlapMenu = closer;
            }
          }, 0);
          isActive.current = true;
          return;
        }

        landscapingMachine.send("MOVE", { name, id });

        isActive.current = true;
      }}
      onDrag={(_, data) => {
        // If item is selected, process drag immediately and close any open menu
        if (isSelected) {
          if (closeCurrentOverlapMenu) closeCurrentOverlapMenu();
          if (showOverlapMenu) {
            setShowOverlapMenu(false);
            if (closeCurrentOverlapMenu === localCloserRef.current) {
              closeCurrentOverlapMenu();
              closeCurrentOverlapMenu = null;
            }
          }
          onDrag({
            data,
            coordinatesX,
            coordinatesY,
            detect,
            setIsDragging,
            setPosition,
            name,
            id,
            location,
            dimensions,
            state: gameService.getSnapshot().context.state,
            setIsColliding,
          });
          return;
        }

        // If item is not selected and there are overlaps, show menu and don't process drag
        if (!dragStartChecked.current && overlaps.length > 1) {
          dragStartChecked.current = true;
          if (closeCurrentOverlapMenu) closeCurrentOverlapMenu();
          setOverlapChoices(overlaps);
          setShowOverlapMenu(true);
          skipNextOutsideClick.current = true;
          const closer = () => {
            setShowOverlapMenu(false);
            dragStartChecked.current = false;
          };
          localCloserRef.current = closer;
          closeCurrentOverlapMenu = closer;
          // Don't process the drag yet, wait for player to select from menu
          return;
        }

        if (overlaps.length === 1 || dragStartChecked.current) {
          onDrag({
            data,
            coordinatesX,
            coordinatesY,
            detect,
            setIsDragging,
            setPosition,
            name,
            id,
            location,
            dimensions,
            state: gameService.getSnapshot().context.state,
            setIsColliding,
          });
        }
      }}
      onStop={(_, data) => {
        dragStartChecked.current = false;
        onStop({
          data,
          coordinatesX,
          coordinatesY,
          id,
          name,
          location,
          dimensions,
        });
      }}
      position={position}
    >
      <div
        ref={nodeRef}
        data-prevent-drag-scroll
        className={classNames("h-full relative", {
          "cursor-grabbing": isDragging,
          "cursor-pointer": !isDragging,
          "z-10": isSelected,
          "z-[1000000]": showOverlapMenu,
        })}
      >
        {showOverlapMenu && overlapChoices.length > 0 && (
          <div
            ref={overlapRef}
            className="absolute z-20"
            style={{
              left: `${PIXEL_SCALE * 18}px`,
              top: `${PIXEL_SCALE * -12}px`,
              minWidth: `${PIXEL_SCALE * 60}px`,
            }}
          >
            <InnerPanel>
              {overlapChoices.map((choice) => {
                let image: string;

                switch (choice.name) {
                  case "Pet":
                    image = getPetImage("happy", Number(choice.id));
                    break;
                  case "Bud":
                    image = getBudImage(Number(choice.id));
                    break;
                  case "FarmHand":
                    image = SUNNYSIDE.achievement.farmHand;
                    break;
                  case "Bumpkin":
                    image = SUNNYSIDE.npcs.bumpkin;
                    break;
                  default:
                    if (choice.name in ITEM_DETAILS) {
                      image = ITEM_DETAILS[choice.name].image;
                    } else {
                      image = SUNNYSIDE.icons.expression_confused;
                    }
                }

                return (
                  <div
                    key={choice.id}
                    className="flex items-center gap-1 px-2 py-1 hover:brightness-90 cursor-pointer"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setShowOverlapMenu(false);
                      dragStartChecked.current = false;
                      // Prevent the menu from reopening on the next mousedown
                      suppressNextMenuOpen.current = true;
                      if (closeCurrentOverlapMenu === localCloserRef.current) {
                        closeCurrentOverlapMenu = null;
                      }
                      landscapingMachine.send("MOVE", {
                        name: choice.name,
                        id: choice.id,
                      });
                    }}
                  >
                    <img src={image} className="h-4 w-4" />
                    <span className="text-xxs">{choice.name}</span>
                  </div>
                );
              })}
            </InnerPanel>
          </div>
        )}
        {isSelected && (
          <div
            className="absolute z-20 flex"
            style={{
              right: `${PIXEL_SCALE * -(hasRemovalAction ? 34 : 12)}px`,
              top: `${PIXEL_SCALE * -12}px`,
            }}
          >
            <div
              className={classNames("relative mr-2", {
                invisible: isPixelPerfectMode,
              })}
              style={{ width: `${PIXEL_SCALE * 18}px` }}
            >
              <img className="w-full" src={SUNNYSIDE.icons.disc} />
              {isDragging ? (
                <img
                  className="absolute"
                  src={SUNNYSIDE.icons.dragging}
                  style={{
                    width: `${PIXEL_SCALE * 12}px`,
                    right: `${PIXEL_SCALE * 4}px`,
                    top: `${PIXEL_SCALE * 4}px`,
                  }}
                />
              ) : (
                <img
                  className="absolute"
                  src={SUNNYSIDE.icons.drag}
                  style={{
                    width: `${PIXEL_SCALE * 14}px`,
                    right: `${PIXEL_SCALE * 2}px`,
                    top: `${PIXEL_SCALE * 2}px`,
                  }}
                />
              )}
            </div>
            {hasFlipAction && (
              <div
                className={classNames("relative mr-2", {
                  invisible: isPixelPerfectMode,
                })}
                style={{ width: `${PIXEL_SCALE * 18}px` }}
                onClick={flip}
              >
                <img className="w-full" src={SUNNYSIDE.icons.disc} />
                {isFlipped ? (
                  <img
                    className="absolute"
                    src={flipped}
                    style={{
                      width: `${PIXEL_SCALE * 12}px`,
                      right: `${PIXEL_SCALE * 3}px`,
                      top: `${PIXEL_SCALE * 4}px`,
                    }}
                  />
                ) : (
                  <img
                    className="absolute"
                    src={flipIcon}
                    style={{
                      width: `${PIXEL_SCALE * 13}px`,
                      right: `${PIXEL_SCALE * 2.5}px`,
                      top: `${PIXEL_SCALE * 4}px`,
                    }}
                  />
                )}
              </div>
            )}
            {hasPixelPerfectAction && (
              <div
                className={classNames("relative mr-2 cursor-pointer", {
                  "opacity-100": isPixelPerfectMode,
                  "opacity-90": !isPixelPerfectMode,
                })}
                style={{ width: `${PIXEL_SCALE * 18}px` }}
                onClick={togglePixelPerfectMode}
              >
                <img className="w-full" src={SUNNYSIDE.icons.disc} />
                <img
                  className="absolute"
                  src={pixelPerfectIcon}
                  style={{
                    width: `${PIXEL_SCALE * 12}px`,
                    right: `${PIXEL_SCALE * 3}px`,
                    top: `${PIXEL_SCALE * 3}px`,
                  }}
                />
              </div>
            )}
            {showRemoveConfirmation && name === "Kuebiko" && (
              <RemoveKuebikoModal
                onClose={() => setShowRemoveConfirmation(false)}
                onRemove={() => remove()}
              />
            )}
            {showRemoveConfirmation && name === "Hungry Caterpillar" && (
              <RemoveHungryCaterpillarModal
                onClose={() => setShowRemoveConfirmation(false)}
                onRemove={() => remove()}
              />
            )}
            {hasRemovalAction && (
              <div
                className={classNames("group relative cursor-pointer", {
                  invisible: isPixelPerfectMode,
                })}
                style={{ width: `${PIXEL_SCALE * 18}px` }}
                onClick={(e) => {
                  remove();
                  e.preventDefault();
                }}
              >
                <img className="w-full" src={SUNNYSIDE.icons.disc} />
                {isSelected && showRemoveConfirmation ? (
                  <>
                    <img
                      className="absolute"
                      src={SUNNYSIDE.icons.confirm}
                      style={{
                        width: `${PIXEL_SCALE * 12}px`,
                        right: `${PIXEL_SCALE * 3}px`,
                        top: `${PIXEL_SCALE * 3}px`,
                      }}
                    />
                  </>
                ) : (
                  <>
                    <img
                      className="absolute"
                      src={ITEM_DETAILS["Rusty Shovel"].image}
                      style={{
                        width: `${PIXEL_SCALE * 12}px`,
                        right: `${PIXEL_SCALE * 3}px`,
                        top: `${PIXEL_SCALE * 3}px`,
                      }}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {/*
          Selection tint anchored to the integer collision tile. The entity can
          sit at a sub-tile offset (savedOX/savedOY plus in-session pixelDelta),
          but collision uses just the integer x/y, so we draw the green/red box
          at the tile by translating back by the saved offset. The offset is
          stored in source pixels, so the screen translation is multiplied by
          PIXEL_SCALE.
        */}
        {isSelected &&
          (() => {
            const tintTransform =
              savedOX !== 0 || savedOY !== 0
                ? `translate(${-savedOX * PIXEL_SCALE}px, ${
                    savedOY * PIXEL_SCALE
                  }px)`
                : undefined;
            return (
              <div
                className={classNames(
                  "absolute inset-0 pointer-events-none z-0",
                  {
                    "bg-red-500 bg-opacity-75": isColliding,
                    "bg-green-300 bg-opacity-50": !isColliding,
                  },
                )}
                style={{ transform: tintTransform }}
              />
            );
          })()}
        <div
          className="relative h-full"
          style={{
            transform:
              pixelDelta.x !== 0 || pixelDelta.y !== 0
                ? `translate(${pixelDelta.x * PIXEL_SCALE}px, ${
                    -pixelDelta.y * PIXEL_SCALE
                  }px)`
                : undefined,
          }}
        >
          {isSelected &&
            isPixelPerfectMode &&
            (() => {
              // Total offset from the integer tile = saved oX/oY plus the
              // in-session pixelDelta. Each arrow is hidden once that total
              // reaches ±0.5 in its axis (8 source pixels of nudge).
              const totalOffsetX = savedOX + pixelDelta.x;
              const totalOffsetY = savedOY + pixelDelta.y;
              const canMoveRight = totalOffsetX < PIXEL_PERFECT_MAX;
              const canMoveLeft = totalOffsetX > -PIXEL_PERFECT_MAX;
              const canMoveUp = totalOffsetY < PIXEL_PERFECT_MAX;
              const canMoveDown = totalOffsetY > -PIXEL_PERFECT_MAX;

              return (
                <>
                  {/* Up arrow — game y is inverted, so visually up = +y */}
                  {canMoveUp && (
                    <img
                      src={SUNNYSIDE.icons.arrow_up}
                      className="absolute cursor-pointer z-30"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePixel(0, 1);
                      }}
                      style={{
                        width: `${PIXEL_SCALE * 10}px`,
                        top: `${-PIXEL_SCALE * 14}px`,
                        left: `calc(50% - ${PIXEL_SCALE * 5}px)`,
                      }}
                    />
                  )}
                  {/* Down arrow */}
                  {canMoveDown && (
                    <img
                      src={SUNNYSIDE.icons.arrow_down}
                      className="absolute cursor-pointer z-30"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePixel(0, -1);
                      }}
                      style={{
                        width: `${PIXEL_SCALE * 10}px`,
                        bottom: `${-PIXEL_SCALE * 14}px`,
                        left: `calc(50% - ${PIXEL_SCALE * 5}px)`,
                      }}
                    />
                  )}
                  {/* Left arrow */}
                  {canMoveLeft && (
                    <img
                      src={SUNNYSIDE.icons.arrow_left}
                      className="absolute cursor-pointer z-30"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePixel(-1, 0);
                      }}
                      style={{
                        width: `${PIXEL_SCALE * 10}px`,
                        left: `${-PIXEL_SCALE * 14}px`,
                        top: `calc(50% - ${PIXEL_SCALE * 5}px)`,
                      }}
                    />
                  )}
                  {/* Right arrow */}
                  {canMoveRight && (
                    <img
                      src={SUNNYSIDE.icons.arrow_right}
                      className="absolute cursor-pointer z-30"
                      onClick={(e) => {
                        e.stopPropagation();
                        movePixel(1, 0);
                      }}
                      style={{
                        width: `${PIXEL_SCALE * 10}px`,
                        right: `${-PIXEL_SCALE * 14}px`,
                        top: `calc(50% - ${PIXEL_SCALE * 5}px)`,
                      }}
                    />
                  )}
                </>
              );
            })()}
          <div className="h-full pointer-events-none">{children}</div>
        </div>
      </div>
    </Draggable>
  );
};
