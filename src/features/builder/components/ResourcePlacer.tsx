import React, { useContext, useRef, useState } from "react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import Draggable from "react-draggable";
import classNames from "classnames";

import fruitPatch from "assets/fruit/apple/apple_tree.png";
import goldStone from "assets/resources/gold_small.png";
import ironStone from "assets/resources/iron_small.png";

import { FruitPatch } from "features/island/fruit/FruitPatch";
import { ResourceBUttons } from "./ResourceButtons";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Stone } from "features/game/expansion/components/resources/stone/Stone";
import { Iron } from "features/game/expansion/components/resources/iron/Iron";
import { Gold } from "features/game/expansion/components/resources/gold/Gold";
import { Plot } from "features/island/plots/Plot";
import { Tree } from "features/game/expansion/components/resources/tree/Tree";
import { Layout } from "../lib/layouts";
import { Boulder } from "features/island/boulder/Boulder";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { ZoomContext } from "components/ZoomProvider";

export const RESOURCES: Record<
  keyof Layout,
  {
    component: React.FC;
    icon: string;
    dimensions: Dimensions;
  }
> = {
  trees: {
    component: () => <Tree id="0" />,
    icon: SUNNYSIDE.resource.tree,
    dimensions: {
      height: 2,
      width: 2,
    },
  },
  fruitPatches: {
    component: () => <FruitPatch id="0" />,
    icon: fruitPatch,
    dimensions: {
      height: 2,
      width: 2,
    },
  },
  stones: {
    component: () => <Stone id="0" />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: SUNNYSIDE.resource.small_stone,
  },
  iron: {
    component: () => <Iron id="0" />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: ironStone,
  },
  gold: {
    component: () => <Gold id="0" />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: goldStone,
  },
  plots: {
    component: () => <Plot id="0" />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: CROP_LIFECYCLE.Sunflower.seedling,
  },
  boulder: {
    component: () => <Boulder />,
    dimensions: {
      height: 2,
      width: 2,
    },
    icon: SUNNYSIDE.resource.boulder,
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
  const { scale } = useContext(ZoomContext);

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
          grid={[GRID_WIDTH_PX * scale.get(), GRID_WIDTH_PX * scale.get()]}
          scale={scale.get()}
          onStart={() => {
            setIsDragging(true);
          }}
          onStop={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round((data.y / GRID_WIDTH_PX) * -1);
            // eslint-disable-next-line no-console
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
