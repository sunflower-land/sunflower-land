import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineInterpreter } from "./editingMachine";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import Draggable from "react-draggable";
import { detectCollision } from "./lib/collisionDetection";
import classNames from "classnames";
import { Coordinates } from "../components/MapPlacement";
import {
  BUILDINGS_DIMENSIONS,
  PlaceableName,
} from "features/game/types/buildings";
import {
  ANIMAL_DIMENSIONS,
  COLLECTIBLES_DIMENSIONS,
} from "features/game/types/craftables";
import { BUILDING_COMPONENTS } from "features/island/buildings/components/building/Building";
import { COLLECTIBLE_COMPONENTS } from "features/island/collectibles/Collectible";
import { Chicken } from "features/island/chickens/Chicken";

import dragIcon from "assets/icons/drag.png";

const PLACEABLES: Record<PlaceableName, React.FC<any>> = {
  Chicken: () => <Chicken index={-1} />, // chicken state is always hungry for index -1
  ...BUILDING_COMPONENTS,
  ...COLLECTIBLE_COMPONENTS,
};

const DEFAULT_POSITION_X = 0;
const DEFAULT_POSITION_Y = 0;

// TODO - get dynamic bounds for placeable
// const BOUNDS_MIN_X = -15
// const BOUNDS_MAX_X = 5
// const BOUNDS_MIN_Y = -5
// const BOUNDS_MAX_Y = 15

export const Placeable: React.FC = () => {
  const nodeRef = useRef(null);
  const { gameService } = useContext(Context);

  const [showHint, setShowHint] = useState(true);
  const collideRef = useRef(false);

  useEffect(() => {
    detect({ x: DEFAULT_POSITION_X, y: -DEFAULT_POSITION_Y });
  }, []);

  const child = gameService.state.children.editing as MachineInterpreter;

  const [machine, send] = useActor(child);
  const { placeable } = machine.context;
  const { width, height } = {
    ...BUILDINGS_DIMENSIONS,
    ...COLLECTIBLES_DIMENSIONS,
    ...ANIMAL_DIMENSIONS,
  }[placeable];

  const detect = ({ x, y }: Coordinates) => {
    const collisionDetected = detectCollision(gameService.state.context.state, {
      x,
      y,
      width,
      height,
    });

    collideRef.current = collisionDetected;

    send({ type: "UPDATE", coordinates: { x, y }, collisionDetected });
  };

  return (
    <>
      <div
        id="bg-overlay "
        className=" bg-black opacity-40 fixed inset-0"
        style={{
          zIndex: 99,
          height: "200%",
          right: "-1000px",
          left: "-1000px",
          top: "-1000px",
          overflow: "hidden",
          bottom: "1000px",
        }}
      />
      <div className="fixed left-1/2 top-1/2" style={{ zIndex: 100 }}>
        <Draggable
          defaultPosition={{
            x: DEFAULT_POSITION_X * GRID_WIDTH_PX,
            y: DEFAULT_POSITION_Y * GRID_WIDTH_PX,
          }}
          nodeRef={nodeRef}
          grid={[GRID_WIDTH_PX, GRID_WIDTH_PX]}
          onStart={() => {
            send("DRAG");
          }}
          onDrag={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round(-data.y / GRID_WIDTH_PX);

            detect({ x, y });
            setShowHint(false);
          }}
          onStop={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round(-data.y / GRID_WIDTH_PX);

            detect({ x, y });

            send("DROP");
          }}
        >
          <div
            ref={nodeRef}
            data-prevent-drag-scroll
            className={classNames("flex flex-col items-center", {
              "cursor-grab": !machine.matches("dragging"),
              "cursor-grabbing": machine.matches("dragging"),
            })}
            style={{ pointerEvents: "auto" }}
          >
            {showHint && (
              <div
                className="flex absolute pointer-events-none"
                style={{
                  top: "-35px",
                  width: "135px",
                }}
              >
                <img src={dragIcon} className="h-6 mr-2" />
                <span className="text-white text-sm">Drag me</span>
              </div>
            )}
            <div
              draggable={false}
              className={classNames(
                " w-full h-full relative img-highlight pointer-events-none",
                {
                  "bg-green-background/80": !collideRef.current,
                  "bg-red-background/80": collideRef.current,
                }
              )}
              style={{
                width: `${width * GRID_WIDTH_PX}px`,
                height: `${height * GRID_WIDTH_PX}px`,
              }}
            >
              {PLACEABLES[placeable]({})}
            </div>
          </div>
        </Draggable>
      </div>
    </>
  );
};
