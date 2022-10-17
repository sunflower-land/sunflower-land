import React, { useRef, useState } from "react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import Draggable from "react-draggable";
import classNames from "classnames";

import appleTree from "assets/fruit/apple/apple_tree.png";
import smallStone from "assets/resources/small_stone.png";

import { FruitPatch } from "features/island/fruit/FruitPatch";
import { ResourceBUttons } from "./ResourceButtons";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Stone } from "features/game/expansion/components/resources/Stone";

export const RESOURCES: Record<
  string,
  {
    component: React.FC;
    icon: string;
    dimensions: Dimensions;
  }
> = {
  appleTree: {
    component: () => <FruitPatch fruit="Apple" />,
    icon: appleTree,
    dimensions: {
      height: 2,
      width: 2,
    },
  },
  stone: {
    component: () => <Stone expansionIndex={0} rockIndex={0} />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: smallStone,
  },
};

type Dimensions = {
  height: number;
  width: number;
};

interface Props {
  name: string;
  onCancel: () => void;
  onPlace: (coords: Coordinates) => void;
}
export const ResourcePlacer: React.FC<Props> = ({
  name,
  onCancel,
  onPlace,
}) => {
  const nodeRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const { component, dimensions } = RESOURCES[name];

  return (
    <>
      <ResourceBUttons
        onDecline={onCancel}
        onConfirm={() => onPlace(coordinates as Coordinates)}
      />
      <div
        className="absolute left-1/2 top-1/2"
        //   style={{ zIndex: calculateZIndex(coordinates.y) }}
      >
        <Draggable
          nodeRef={nodeRef}
          grid={[GRID_WIDTH_PX, GRID_WIDTH_PX]}
          onStart={() => {
            setIsDragging(true);
          }}
          onDrag={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round((data.y / GRID_WIDTH_PX) * -1);
          }}
          onStop={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round((data.y / GRID_WIDTH_PX) * -1);
            console.log({ drop: { x, y } });
            setIsDragging(false);
            setCoordinates({ x, y });
          }}
        >
          <div
            ref={nodeRef}
            data-prevent-drag-scroll
            className={classNames("flex flex-col items-center", {
              "cursor-grab": !isDragging,
              "cursor-grabbing": isDragging,
            })}
            style={{ pointerEvents: "auto" }}
          >
            <div
              draggable={false}
              className=" w-full h-full relative img-highlight pointer-events-none"
              style={{
                //   zIndex: 100 + coordinates.y + 1,
                width: `${dimensions.width * GRID_WIDTH_PX}px`,
                height: `${dimensions.height * GRID_WIDTH_PX}px`,
              }}
            >
              {component({})}
            </div>
          </div>
        </Draggable>
      </div>
    </>
  );
};
