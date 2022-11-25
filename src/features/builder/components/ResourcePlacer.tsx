import React, { useRef, useState } from "react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import Draggable from "react-draggable";
import classNames from "classnames";

import tree from "assets/resources/tree.png";
import fruitPatch from "assets/fruit/apple/apple_tree.png";
import smallStone from "assets/resources/small_stone.png";
import goldStone from "assets/resources/gold_small.png";
import ironStone from "assets/resources/iron_small.png";
import boulder from "assets/resources/rare_mine.png";
import plot from "assets/crops/sunflower/seedling.png";

import { FruitPatch } from "features/island/fruit/FruitPatch";
import { ResourceBUttons } from "./ResourceButtons";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Stone } from "features/game/expansion/components/resources/Stone";
import { Iron } from "features/game/expansion/components/resources/Iron";
import { Gold } from "features/game/expansion/components/resources/Gold";
import { Plot } from "features/island/plots/Plot";
import { Tree } from "features/game/expansion/components/resources/Tree";
import { Layout } from "../lib/layouts";
import { Boulder } from "features/island/boulder/Boulder";

export const RESOURCES: Record<
  keyof Layout,
  {
    component: React.FC;
    icon: string;
    dimensions: Dimensions;
  }
> = {
  trees: {
    component: () => <Tree expansionIndex={0} treeIndex={0} />,
    icon: tree,
    dimensions: {
      height: 2,
      width: 2,
    },
  },
  fruitPatches: {
    component: () => <FruitPatch fruit="Apple" />,
    icon: fruitPatch,
    dimensions: {
      height: 2,
      width: 2,
    },
  },
  stones: {
    component: () => <Stone expansionIndex={0} rockIndex={0} />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: smallStone,
  },
  iron: {
    component: () => <Iron expansionIndex={0} ironIndex={0} />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: ironStone,
  },
  gold: {
    component: () => <Gold expansionIndex={0} rockIndex={0} />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: goldStone,
  },
  plots: {
    component: () => <Plot expansionIndex={0} plotIndex={0} />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: plot,
  },
  boulder: {
    component: () => <Boulder />,
    dimensions: {
      height: 2,
      width: 2,
    },
    icon: boulder,
  },
};

type Dimensions = {
  height: number;
  width: number;
};

interface Props {
  name: keyof Layout;
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

  console.log({ coordinates });
  return (
    <>
      <ResourceBUttons
        onDecline={onCancel}
        onConfirm={() => onPlace(coordinates as Coordinates)}
      />
      <div
        className="absolute"
        //   style={{ zIndex: calculateZIndex(coordinates.y) }}
        style={{
          width: `${36 * GRID_WIDTH_PX}px`,
          height: `${36 * GRID_WIDTH_PX}px`,
          marginTop: "20px",
          marginLeft: "20px",
        }}
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
