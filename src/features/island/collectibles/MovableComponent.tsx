import React, {
  useCallback,
  useContext,
  useEffect,
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
import debounce from "lodash.debounce";
import { LIMITED_ITEMS } from "features/game/events/landExpansion/burnCollectible";
import { PET_SHRINES } from "features/game/types/pets";
import {
  EXPIRY_COOLDOWNS,
  TemporaryCollectibleName,
} from "features/game/lib/collectibleBuilt";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { getPetImage } from "../pets/lib/petShared";
import { budImageDomain } from "./components/Bud";
import { useNow } from "lib/utils/hooks/useNow";
import { isPetCollectible } from "features/game/events/landExpansion/placeCollectible";

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
    if (isActive.current && !isSelected) {
      // Reset
      setCounts((prev) => prev + 1);
      setIsColliding(false);
      setShowRemoveConfirmation(false);
      setPosition({ x: 0, y: 0 });
      isActive.current = false;
    }
  }, [isSelected, movingItem]);

  const DIMENSIONS_MAP: Record<LandscapingPlaceable, Dimensions> = {
    ...BUILDINGS_DIMENSIONS,
    ...COLLECTIBLES_DIMENSIONS,
    ...RESOURCE_DIMENSIONS,
    Bud: { width: 1, height: 1 },
    Pet: { width: 2, height: 2 },
    FarmHand: { width: 1, height: 1 },
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
                : name === "FarmHand"
                  ? {}
                  : { name }),
            coordinates: { x, y },
            id,
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Immediately return if in placing mode
      if (isPlacing) {
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
      disabled={(isMobile && !isSelected) || shouldDisableDrag}
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
                const image =
                  choice.name === "Pet"
                    ? getPetImage("happy", Number(choice.id))
                    : choice.name === "Bud"
                      ? `https://${budImageDomain}.sunflower-land.com/images/${choice.id}.webp`
                      : choice.name === "FarmHand"
                        ? SUNNYSIDE.achievement.farmHand
                        : ITEM_DETAILS[choice.name].image;

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
              className="relative mr-2"
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
                className="relative mr-2"
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
                className={"group relative cursor-pointer"}
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
        <div
          className={classNames("h-full pointer-events-none", {
            "bg-red-500 bg-opacity-75": isColliding,
            "bg-green-300 bg-opacity-50": !isColliding && isSelected,
          })}
        >
          {children}
        </div>
      </div>
    </Draggable>
  );
};
