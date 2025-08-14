import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

import {
  ANIMAL_DIMENSIONS,
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
  MachineInterpreter,
  MachineState,
} from "features/game/expansion/placeable/landscapingMachine";
import {
  BUILDINGS_DIMENSIONS,
  BuildingName,
  Dimensions,
} from "features/game/types/buildings";
import { GameEventName, PlacementEvent } from "features/game/events";
import { RESOURCES, ResourceName } from "features/game/types/resources";
import { GameState, InventoryItemName } from "features/game/types/game";
import { removePlaceable } from "./lib/placing";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { isMobile } from "mobile-device-detect";
import { ZoomContext } from "components/ZoomProvider";
import { RemoveKuebikoModal } from "./RemoveKuebikoModal";
import { PlaceableLocation } from "features/game/types/collectibles";
import { RemoveHungryCaterpillarModal } from "./RemoveHungryCaterpillarModal";
import { HourglassType } from "./components/Hourglass";
import { HOURGLASSES } from "features/game/events/landExpansion/burnCollectible";
import flipped from "assets/icons/flipped.webp";
import flipIcon from "assets/icons/flip.webp";
import debounce from "lodash.debounce";

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
  "Crimstone Rock": "crimstone.moved",
  Boulder: "tree.moved",
  Beehive: "beehive.moved",
  "Flower Bed": "flowerBed.moved",
  "Sunstone Rock": "sunstone.moved",
  "Oil Reserve": "oilReserve.moved",
  "Lava Pit": "lavaPit.moved",
};

function getMoveAction(
  name: InventoryItemName | "Bud",
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

  if (name === "Chicken") {
    return "chicken.moved";
  }

  if (name === "Bud") {
    return "bud.moved";
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
  "Crimstone Rock": "crimstone.removed",
  Beehive: "beehive.removed",
  "Flower Bed": "flowerBed.removed",
  "Sunstone Rock": "sunstone.removed",
  "Oil Reserve": "oilReserve.removed",
  "Lava Pit": "lavaPit.removed",
};

export function getRemoveAction(
  name: InventoryItemName | "Bud",
): GameEventName<PlacementEvent> | null {
  if (
    name in BUILDINGS_DIMENSIONS &&
    name !== "Manor" &&
    name !== "Town Center" &&
    name !== "House" &&
    name !== "Mansion"
  ) {
    return "building.removed";
  }

  if (
    HOURGLASSES.includes(name as HourglassType) ||
    name === "Time Warp Totem" ||
    name === "Super Totem"
  ) {
    return null;
  }

  if (name === "Chicken") {
    return "chicken.removed";
  }

  if (name in COLLECTIBLES_DIMENSIONS) {
    return "collectible.removed";
  }

  if (name === "Bud") {
    return "bud.removed";
  }

  if (name in RESOURCES_REMOVE_ACTIONS) {
    return RESOURCES_REMOVE_ACTIONS[name as Exclude<ResourceName, "Boulder">];
  }

  return null;
}

export const isCollectible = (
  name: CollectibleName | BuildingName | "Chicken" | "Bud",
): name is CollectibleName => name in COLLECTIBLES_DIMENSIONS;

export interface MovableProps {
  name: CollectibleName | BuildingName | "Chicken" | "Bud";
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
    name: CollectibleName,
    id: string,
    location: PlaceableLocation,
    dimensions: Dimensions,
    setIsColliding: (isColliding: boolean) => void,
  ) => void;
  setIsDragging: (isDragging: boolean) => void;
  setPosition: (position: Coordinates) => void;
  name: CollectibleName;
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
  name: CollectibleName,
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
    name: name as CollectibleName,
    state: game,
    location,
    position: { x, y, ...dimensions },
  });

  setIsColliding(collisionDetected);
  // send({ type: "UPDATE", coordinates: { x, y }, collisionDetected });
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

  const nodeRef = useRef(null);

  const { gameService } = useContext(Context);
  const [isColliding, setIsColliding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [counts, setCounts] = useState(0);
  const [position, setPosition] = useState<Coordinates>({
    x: 0,
    y: 0,
  });
  const state = useSelector(gameService, (state) => state.context.state);

  const isActive = useRef(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);

  const landscapingMachine = gameService.getSnapshot().children
    .landscaping as MachineInterpreter;

  const movingItem = useSelector(landscapingMachine, getMovingItem);

  const isPlacing = useSelector(landscapingMachine, (state) =>
    state.matches({ editing: "placing" }),
  );

  const isSelected = movingItem?.id === id && movingItem?.name === name;

  const removeAction = !isMobile && getRemoveAction(name);
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
        ? state.context.state.home.collectibles
        : state.context.state.collectibles;
    return (
      collectibles[name]?.find((collectible) => collectible.id === id)
        ?.flipped ?? false
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

  const dimensions = {
    ...BUILDINGS_DIMENSIONS,
    ...COLLECTIBLES_DIMENSIONS,
    ...ANIMAL_DIMENSIONS,
    ...RESOURCE_DIMENSIONS,
    ...{ Bud: { width: 1, height: 1 } },
  }[name];

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
        name: CollectibleName | BuildingName | "Chicken" | "Bud";
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

        const game = removePlaceable({ state, id, name });
        const collisionDetected = detectCollision({
          name: name as CollectibleName,
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
            ...(name in RESOURCE_MOVE_EVENTS || name === "Bud" ? {} : { name }),
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
          name: name as CollectibleName,
          id,
          location,
          dimensions,
          state,
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
          name: name as CollectibleName,
          id,
          location,
          dimensions,
          state,
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
          name: name as CollectibleName,
          id,
          location,
          dimensions,
          state,
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
          name: name as CollectibleName,
          id,
          location,
          dimensions,
          state,
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
    id,
    isPlacing,
    isSelected,
    location,
    name,
    onStop,
    position,
    state,
  ]);

  return (
    <Draggable
      key={`${coordinatesX}-${coordinatesY}-${counts}`}
      nodeRef={nodeRef}
      grid={[GRID_WIDTH_PX * scale.get(), GRID_WIDTH_PX * scale.get()]}
      scale={scale.get()}
      allowAnyClick
      // Mobile must click first, before dragging
      disabled={isMobile && !isSelected}
      onMouseDown={() => {
        // Mobile must click first, before dragging

        if (isMobile && !isActive.current) {
          isActive.current = true;

          return;
        }

        landscapingMachine.send("MOVE", { name, id });

        isActive.current = true;
      }}
      onDrag={(_, data) => {
        onDrag({
          data,
          coordinatesX,
          coordinatesY,
          detect,
          setIsDragging,
          setPosition,
          name: name as CollectibleName,
          id,
          location,
          dimensions,
          state,
          setIsColliding,
        });
      }}
      onStop={(_, data) =>
        onStop({
          data,
          coordinatesX,
          coordinatesY,
          id,
          name,
          location,
          dimensions,
        })
      }
      position={position}
    >
      <div
        ref={nodeRef}
        data-prevent-drag-scroll
        className={classNames("h-full relative", {
          "cursor-grabbing": isDragging,
          "cursor-pointer": !isDragging,
          "z-10": isSelected,
        })}
      >
        {isSelected && (
          <div
            className="absolute z-10 flex"
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
