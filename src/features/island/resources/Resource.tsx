import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
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
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { MoveableComponent } from "../collectibles/Collectible";

export interface ResourceProps {
  name: ResourceName;
  id: string;
  readyAt: number;
  createdAt: number;
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
}) => {
  const Component = RESOURCE_COMPONENTS[name];

  return (
    <>
      <Component
        key={id}
        createdAt={createdAt}
        id={id}
        name={name}
        readyAt={readyAt}
      />
    </>
  );
};

export const Resource: React.FC<ResourceProps> = (props) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  if (gameState.matches("landscaping")) {
    return (
      <MoveableComponent {...props}>
        <ResourceComponent {...props} />
      </MoveableComponent>
    );
  }

  return <ResourceComponent {...props} />;
};
