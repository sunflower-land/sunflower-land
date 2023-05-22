import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ResourceName } from "features/game/types/resources";
import { Gold } from "features/game/expansion/components/resources/Gold";
import { Iron } from "features/game/expansion/components/resources/Iron";
import { Stone } from "features/game/expansion/components/resources/Stone";
import { Tree } from "features/game/expansion/components/resources/tree/Tree";
import { SUNNYSIDE } from "assets/sunnyside";
import { Plot } from "../plots/Plot";
import { FruitPatch } from "../fruit/FruitPatch";
import { Boulder } from "../boulder/Boulder";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor, useSelector } from "@xstate/react";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { MoveableComponent } from "../collectibles/MovableComponent";
import { MachineState } from "features/game/lib/gameMachine";
import { isAOELocked } from "features/game/events/landExpansion/moveCrop";
import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";

export interface ResourceProps {
  name: ResourceName;
  id: string;
  readyAt: number;
  createdAt: number;
  coordinates?: Coordinates;
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

// const ResourceComponent: React.FC<ResourceProps> = ({
//   name,
//   id,
//   readyAt,
//   createdAt,
// }) => {
//   const Component = RESOURCE_COMPONENTS[name];

//   return (
//     <>
//       <Component
//         key={id}
//         createdAt={createdAt}
//         id={id}
//         name={name}
//         readyAt={readyAt}
//       />
//     </>
//   );
// };
const isLandscaping = (state: MachineState) => state.matches("landscaping");

const ResourceComponent: React.FC<ResourceProps> = (props) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showPopover, setShowPopover] = useState(false);

  const landscaping = useSelector(gameService, isLandscaping);

  const Component = RESOURCE_COMPONENTS[props.name];

  const isPlot = props.name === "Crop Plot";

  const plot = gameState.context.state.crops[props.id];
  const collectibles = gameState.context.state.collectibles;

  const handleMouseEnter = () => {
    // set state to show details
    setShowPopover(true);
  };

  const handleMouseLeave = () => {
    // set state to hide details
    setShowPopover(false);
  };

  if (landscaping) {
    if (isPlot && isAOELocked(plot, collectibles, Date.now())) {
      return (
        <div
          className="relative w-full h-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <InnerPanel
            className={classNames(
              "transition-opacity absolute whitespace-nowrap sm:opacity-0 w-fit z-50 pointer-events-none",
              {
                "opacity-100": showPopover,
                "opacity-0": !showPopover,
              }
            )}
            style={{
              top: `${PIXEL_SCALE * -10}px`,
              left: `${PIXEL_SCALE * 16}px`,
            }}
          >
            <div className="flex flex-col text-xxs text-white text-shadow mx-2">
              <div className="flex flex-1 items-center justify-center">
                <img src={SUNNYSIDE.icons.cancel} className="w-4 mr-1" />
                <span>AoE Locked</span>
              </div>
            </div>
          </InnerPanel>
          <div className="relative">
            <Component {...props} />
          </div>
        </div>
      );
    }

    return (
      <MoveableComponent {...(props as any)}>
        <Component {...props} />
      </MoveableComponent>
    );
  }

  return <Component {...props} />;
};

export const Resource = React.memo(ResourceComponent);
