import React, { useContext, useRef, useState } from "react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import Draggable from "react-draggable";
import classNames from "classnames";

import crimstone from "assets/resources/crimstone/crimstone_rock_1.webp";
import beehive from "assets/sfts/beehive.webp";

import { FruitPatch } from "features/island/fruit/FruitPatch";
import { ResourceBUttons } from "./ResourceButtons";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Stone } from "features/game/expansion/components/resources/stone/Stone";
import { Iron } from "features/game/expansion/components/resources/iron/Iron";
import { Gold } from "features/game/expansion/components/resources/gold/Gold";
import { Crimstone } from "features/game/expansion/components/resources/crimstone/Crimstone";
import { Plot } from "features/island/plots/Plot";
import { Tree } from "features/game/expansion/components/resources/tree/Tree";
import { Layout } from "../lib/layouts";
import { Boulder } from "features/island/boulder/Boulder";
import { Beehive } from "features/game/expansion/components/resources/beehive/Beehive";
import { SUNNYSIDE } from "assets/sunnyside";
import { PLOT_CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { ZoomContext } from "components/ZoomProvider";
import { Sunstone } from "features/game/expansion/components/resources/sunstone/Sunstone";
import { ITEM_DETAILS } from "features/game/types/images";
import { FlowerBed } from "features/island/flowers/FlowerBed";
import { OilReserve } from "features/game/expansion/components/resources/oilReserve/OilReserve";

const fruitPatch = SUNNYSIDE.fruit.apple_tree;
const goldStone = SUNNYSIDE.fruit.apple_tree;
const ironStone = SUNNYSIDE.fruit.apple_tree;
export const RESOURCES: Record<
  keyof Layout,
  {
    component: React.FC;
    icon: string;
    dimensions: Dimensions;
  }
> = {
  trees: {
    component: () => <Tree id="1" index={0} />,
    icon: SUNNYSIDE.resource.tree,
    dimensions: {
      height: 2,
      width: 2,
    },
  },
  fruitPatches: {
    component: () => <FruitPatch id="1" index={0} />,
    icon: fruitPatch,
    dimensions: {
      height: 2,
      width: 2,
    },
  },
  stones: {
    component: () => <Stone id="1" index={0} />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: SUNNYSIDE.resource.small_stone,
  },
  iron: {
    component: () => <Iron id="1" index={0} />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: ironStone,
  },
  gold: {
    component: () => <Gold id="1" index={0} />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: goldStone,
  },
  crimstones: {
    component: () => <Crimstone id="1" index={0} />,
    dimensions: {
      height: 2,
      width: 2,
    },
    icon: crimstone,
  },
  sunstones: {
    component: () => <Sunstone id="1" index={0} />,
    dimensions: {
      height: 2,
      width: 2,
    },
    icon: ITEM_DETAILS["Sunstone"].image,
  },
  plots: {
    component: () => <Plot id="1" index={0} />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: PLOT_CROP_LIFECYCLE.Sunflower.seedling,
  },
  boulder: {
    component: () => <Boulder />,
    dimensions: {
      height: 2,
      width: 2,
    },
    icon: SUNNYSIDE.resource.boulder,
  },
  beehives: {
    component: () => <Beehive id="1" />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: beehive,
  },
  flowers: {
    component: () => <FlowerBed id="1" />,
    dimensions: {
      height: 1,
      width: 1,
    },
    icon: ITEM_DETAILS["Tulip Bulb"].image,
  },
  oilReserves: {
    component: () => <OilReserve id="1" />,
    dimensions: {
      height: 2,
      width: 2,
    },
    icon: ITEM_DETAILS["Oil Reserve"].image,
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
