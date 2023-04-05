import React from "react";
import classNames from "classnames";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { ResourceName } from "features/game/types/resources";
import { Gold } from "features/game/expansion/components/resources/Gold";
import { Iron } from "features/game/expansion/components/resources/Iron";
import { Stone } from "features/game/expansion/components/resources/Stone";
import { Tree } from "features/game/expansion/components/resources/Tree";
import { SUNNYSIDE } from "assets/sunnyside";
import { Plot } from "../plots/Plot";
import { FruitPatch } from "../fruit/FruitPatch";
import { Boulder } from "../boulder/Boulder";
import { ITEM_DETAILS } from "features/game/types/images";

export interface ResourceProps {
  name: ResourceName;
  id: string;
  readyAt: number;
  createdAt: number;

  height?: number;
  width?: number;
  x: number;
  y: number;
  isEditing?: boolean;
}

// Used for placing
export const READONLY_RESOURCE_COMPONENTS: Record<
  ResourceName,
  React.FC<ResourceProps>
> = {
  "Crop Plot": () => (
    <img
      src={SUNNYSIDE.resource.plot}
      className="absolute bottom-0 w-full"
      style={{
        width: `${PIXEL_SCALE * 18}px`,
      }}
    />
  ),
  "Gold Rock": () => (
    <img
      src={ITEM_DETAILS["Gold Rock"].image}
      className="relative  w-full"
      style={{
        width: `${PIXEL_SCALE * 14}px`,
        top: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
    />
  ),
  "Iron Rock": () => (
    <img
      src={ITEM_DETAILS["Iron Rock"].image}
      className="relative h-full w-full"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
    />
  ),
  "Stone Rock": () => (
    <img
      src={ITEM_DETAILS["Stone Rock"].image}
      className="relative w-full"
      style={{
        width: `${PIXEL_SCALE * 14}px`,
        top: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
    />
  ),
  Tree: () => (
    <img
      src={SUNNYSIDE.resource.tree}
      className="absolute h-auto w-full"
      style={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * -4}px`,
      }}
    />
  ),
  "Fruit Patch": () => (
    <img
      src={ITEM_DETAILS["Fruit Patch"].image}
      className="absolute  "
      style={{
        width: `${PIXEL_SCALE * 30}px`,
        top: `${PIXEL_SCALE * 2}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
    />
  ),
  Boulder: () => (
    <img
      src={SUNNYSIDE.resource.boulder}
      className="absolute h-auto w-full"
      style={{
        width: `${PIXEL_SCALE * 32}px`,
        bottom: `${PIXEL_SCALE * -4}px`,
      }}
    />
  ),
};

export const RESOURCE_COMPONENTS: Record<
  ResourceName,
  React.FC<ResourceProps>
> = {
  "Crop Plot": Plot,
  "Gold Rock": Gold,
  "Iron Rock": Iron,
  "Stone Rock": Stone,
  Tree: Tree,
  "Fruit Patch": FruitPatch,
  Boulder: Boulder,
};

const ResourceComponent: React.FC<ResourceProps> = ({
  name,
  id,
  readyAt,
  createdAt,

  x,
  y,
  height,
  width,
  isEditing,
}) => {
  const Component = RESOURCE_COMPONENTS[name];

  return (
    <>
      <div
        className={classNames("absolute", {
          "bg-red-background/80": isEditing,
        })}
        style={{
          top: `calc(50% - ${GRID_WIDTH_PX * y}px)`,
          left: `calc(50% + ${GRID_WIDTH_PX * x}px)`,
          height: height ? `${GRID_WIDTH_PX * height}px` : "auto",
          width: width ? `${GRID_WIDTH_PX * width}px` : "auto",
        }}
      >
        <Component
          key={id}
          createdAt={createdAt}
          id={id}
          name={name}
          readyAt={readyAt}
          x={x}
          y={y}
          height={height}
          width={width}
        />
      </div>
    </>
  );
};

export const Resource = React.memo(ResourceComponent);
