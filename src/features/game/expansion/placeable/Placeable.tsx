import React, { useContext, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineInterpreter } from "./editingMachine";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import Draggable from "react-draggable";
import { detectCollision } from "./lib/collisionDetection";
import classNames from "classnames";
import { calculateZIndex, Coordinates } from "../components/MapPlacement";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import { ITEM_DETAILS } from "features/game/types/images";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";

type Dimensions = {
  height: number;
  width: number;
};

export const Placeable: React.FC = () => {
  const nodeRef = useRef(null);
  const { gameService } = useContext(Context);
  const [imageDimensions, setImageDimensions] = useState<Dimensions>({
    height: 0,
    width: 0,
  });

  const child = gameService.state.children.editing as MachineInterpreter;

  const [machine, send] = useActor(child);

  const { placeable, coordinates } = machine.context;
  const { width, height } = {
    ...BUILDINGS_DIMENSIONS,
    ...COLLECTIBLES_DIMENSIONS,
  }[placeable];
  const { image } = ITEM_DETAILS[placeable];

  const handleImageLoad = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const { naturalHeight, naturalWidth } = e.currentTarget;

    setImageDimensions({
      width: naturalWidth,
      height: naturalHeight,
    });
  };

  const detect = ({ x, y }: Coordinates) => {
    const collisionDetected = detectCollision(gameService.state.context.state, {
      x,
      y,
      width,
      height,
    });

    send({ type: "UPDATE", coordinates: { x, y }, collisionDetected });
  };

  if (machine.matches("placed")) {
    return (
      <div className="absolute left-1/2 top-1/2">
        <div
          className="absolute"
          style={{
            left: coordinates.x * GRID_WIDTH_PX,
            top: -coordinates.y * GRID_WIDTH_PX,
            height: imageDimensions.height * PIXEL_SCALE,
            width: imageDimensions.width * PIXEL_SCALE,
          }}
        >
          <img
            draggable="false"
            className="bulge h-full w-full"
            src={image}
            alt=""
            onLoad={handleImageLoad}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ zIndex: calculateZIndex(coordinates.y) }}
    >
      <Draggable
        nodeRef={nodeRef}
        grid={[GRID_WIDTH_PX, GRID_WIDTH_PX]}
        onStart={() => {
          send("DRAG");
        }}
        onDrag={(_, data) => {
          const x = Math.round(data.x / GRID_WIDTH_PX);
          const y = Math.round((data.y / GRID_WIDTH_PX) * -1);

          detect({ x, y });
        }}
        onStop={(_, data) => {
          const x = Math.round(data.x / GRID_WIDTH_PX);
          const y = Math.round((data.y / GRID_WIDTH_PX) * -1);

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
          <img
            draggable="false"
            className="img-highlight"
            style={{
              height: imageDimensions.height * PIXEL_SCALE,
              width: imageDimensions.width * PIXEL_SCALE,
              zIndex: 100 + coordinates.y + 1,
            }}
            src={image}
            alt={placeable}
            onLoad={handleImageLoad}
          />
        </div>
      </Draggable>
    </div>
  );
};
