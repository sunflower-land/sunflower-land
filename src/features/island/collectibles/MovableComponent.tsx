import React, { useContext, useEffect, useRef, useState } from "react";
import classNames from "classnames";

import {
  ANIMAL_DIMENSIONS,
  COLLECTIBLES_DIMENSIONS,
  CollectibleName,
} from "features/game/types/craftables";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";

import { Coordinates } from "features/game/expansion/components/MapPlacement";
import Draggable from "react-draggable";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { useSelector } from "@xstate/react";
import {
  MachineInterpreter,
  MachineState,
} from "features/game/expansion/placeable/landscapingMachine";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import { GameEventName, PlacementEvent } from "features/game/events";
import { RESOURCES, ResourceName } from "features/game/types/resources";
import { InventoryItemName } from "features/game/types/game";

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
  Boulder: "tree.moved",
};

function getMoveAction(name: InventoryItemName): GameEventName<PlacementEvent> {
  if (name in BUILDINGS_DIMENSIONS) {
    return "building.moved";
  }

  if (name in RESOURCES) {
    return RESOURCE_MOVE_EVENTS[name as ResourceName];
  }

  if (name in COLLECTIBLES_DIMENSIONS) {
    return "collectible.moved";
  }

  throw new Error("No matching move event");
}

interface MovableProps {
  name: CollectibleName;
  id: string;
  x: number;
  y: number;
}

const isMoving = (state: MachineState) => state.matches("editing.moving");
const getMovingItem = (state: MachineState) => state.context.moving;

export const MoveableComponent: React.FC<MovableProps> = ({
  name,
  id,
  x: coordinatesX,
  y: coordinatesY,
  children,
}) => {
  const nodeRef = useRef(null);
  const { gameService } = useContext(Context);
  const [isColliding, setIsColliding] = useState(false);
  const [counts, setCounts] = useState(0);
  const isActive = useRef(false);

  const landscapingMachine = gameService.state.children
    .landscaping as MachineInterpreter;

  const moving = useSelector(landscapingMachine, isMoving);
  const movingItem = useSelector(landscapingMachine, getMovingItem);

  useEffect(() => {
    if (isActive.current && movingItem?.id !== id) {
      console.log("Reset");
      // Reset
      setCounts((prev) => prev + 1);
      setIsColliding(false);
      isActive.current = false;
    }
  }, [movingItem]);

  const dimensions = {
    ...BUILDINGS_DIMENSIONS,
    ...COLLECTIBLES_DIMENSIONS,
    ...ANIMAL_DIMENSIONS,
  }[name];

  const detect = ({ x, y }: Coordinates) => {
    const collisionDetected = detectCollision(gameService.state.context.state, {
      x,
      y,
      width: dimensions.width,
      height: dimensions.height,
    });

    setIsColliding(collisionDetected);
    // send({ type: "UPDATE", coordinates: { x, y }, collisionDetected });
  };

  const origin = useRef<Coordinates>({ x: 0, y: 0 });

  return (
    <>
      <Draggable
        key={`${coordinatesX}-${coordinatesY}-${counts}`}
        nodeRef={nodeRef}
        grid={[GRID_WIDTH_PX, GRID_WIDTH_PX]}
        disabled={!moving}
        onMouseDown={() => {
          console.log("Mouse down");
          landscapingMachine.send("HIGHLIGHT", {
            name,
            id,
          });
          isActive.current = true;
        }}
        onStart={(_, data) => {
          const x = Math.round(data.x);
          const y = Math.round(-data.y);
          origin.current = { x, y };
          console.log({ x, y });
          // reset
          // send("DRAG");
        }}
        onDrag={(_, data) => {
          const xDiff = Math.round((origin.current.x + data.x) / GRID_WIDTH_PX);
          const yDiff = Math.round((origin.current.y - data.y) / GRID_WIDTH_PX);

          console.log({ coordinatesX, coordinatesY });
          const x = coordinatesX + xDiff;
          const y = coordinatesY + yDiff;
          console.log({ x, y });
          detect({ x, y });
          // setShowHint(false);
        }}
        onStop={(_, data) => {
          const xDiff = Math.round((origin.current.x + data.x) / GRID_WIDTH_PX);
          const yDiff = Math.round((origin.current.y - data.y) / GRID_WIDTH_PX);

          const x = coordinatesX + xDiff;
          const y = coordinatesY + yDiff;
          console.log({ xDiff, yDiff, origin });

          const collisionDetected = detectCollision(
            gameService.state.context.state,
            {
              x,
              y,
              width: dimensions.width,
              height: dimensions.height,
            }
          );

          if (!collisionDetected) {
            gameService.send(getMoveAction(name), {
              // Don't send name for resource events
              ...(name in RESOURCE_MOVE_EVENTS ? {} : { name }),
              coordinates: {
                x: coordinatesX + xDiff,
                y: coordinatesY + yDiff,
              },
              id,
            });
          }
        }}
      >
        <div
          ref={nodeRef}
          data-prevent-drag-scroll
          className={classNames("h-full cursor-pointer")}
        >
          <div
            className={classNames("h-full", {
              "opacity-50": isColliding,
              "opacity-100": !isColliding,
            })}
          >
            {children}
          </div>
        </div>
      </Draggable>
    </>
  );
};
