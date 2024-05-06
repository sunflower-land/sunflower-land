import React, { useContext, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ResourceName } from "features/game/types/resources";
import { Gold } from "features/game/expansion/components/resources/gold/Gold";
import { Iron } from "features/game/expansion/components/resources/iron/Iron";
import { Stone } from "features/game/expansion/components/resources/stone/Stone";
import { Tree } from "features/game/expansion/components/resources/tree/Tree";
import { SUNNYSIDE } from "assets/sunnyside";
import { Plot } from "../plots/Plot";
import { FruitPatch } from "../fruit/FruitPatch";
import { Boulder } from "../boulder/Boulder";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MoveableComponent } from "../collectibles/MovableComponent";
import { MachineState } from "features/game/lib/gameMachine";
import { isLocked as isPlotLocked } from "features/game/events/landExpansion/moveCrop";
import { isLocked as isStoneLocked } from "features/game/events/landExpansion/moveStone";
import { isLocked as isIronLocked } from "features/game/events/landExpansion/moveIron";
import { isLocked as isGoldLocked } from "features/game/events/landExpansion/moveGold";
import { InnerPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import lockIcon from "assets/skills/lock.png";
import { Crimstone } from "features/game/expansion/components/resources/crimstone/Crimstone";
import { Beehive } from "features/game/expansion/components/resources/beehive/Beehive";
import { FlowerBed } from "../flowers/FlowerBed";
import { Sunstone } from "features/game/expansion/components/resources/sunstone/Sunstone";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export interface ResourceProps {
  name: ResourceName;
  id: string;
  index: number;
  readyAt: number;
  createdAt: number;
  x: number;
  y: number;
}

// Used for placing
export const READONLY_RESOURCE_COMPONENTS: Record<
  ResourceName,
  React.FC<ResourceProps>
> = {
  "Crop Plot": () => (
    <div
      className="relative"
      style={{
        width: `${PIXEL_SCALE * 20}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        right: `${PIXEL_SCALE * 2}px`,
      }}
    >
      <img
        src={SUNNYSIDE.resource.plot}
        style={{
          width: `${PIXEL_SCALE * 20}px`,
        }}
      />
    </div>
  ),
  "Gold Rock": () => (
    <div
      style={{
        width: `${PIXEL_SCALE * 14}px`,
        top: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Gold Rock"].image}
        className="relative pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 14}px`,
          top: `${PIXEL_SCALE * 3}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
      />
    </div>
  ),
  "Iron Rock": () => (
    <img
      src={ITEM_DETAILS["Iron Rock"].image}
      className="relative"
      style={{
        width: `${PIXEL_SCALE * 14}px`,
        top: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
    />
  ),
  "Stone Rock": () => (
    <img
      src={ITEM_DETAILS["Stone Rock"].image}
      className="relative"
      style={{
        width: `${PIXEL_SCALE * 14}px`,
        top: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
    />
  ),
  "Crimstone Rock": () => (
    <img
      src={ITEM_DETAILS["Crimstone Rock"].image}
      className="relative"
      style={{
        width: `${PIXEL_SCALE * 14}px`,
        top: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
    />
  ),
  "Oil Reserve": () => (
    <img
      src={ITEM_DETAILS["Oil Reserve"].image}
      className="relative"
      style={{
        width: `${PIXEL_SCALE * 30}px`,
        top: `${PIXEL_SCALE * 3}px`,
        left: `${PIXEL_SCALE * 1}px`,
      }}
    />
  ),
  Tree: () => (
    <img
      src={SUNNYSIDE.resource.tree}
      className="relative"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 2}px`,
        right: `${PIXEL_SCALE * 3}px`,
      }}
    />
  ),
  "Fruit Patch": () => (
    <img
      src={ITEM_DETAILS["Fruit Patch"].image}
      className="absolute"
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
  Beehive: () => (
    <img
      src={ITEM_DETAILS["Beehive"].image}
      className="absolute bottom-0 h-auto w-full"
      style={{
        width: `${PIXEL_SCALE * 16}px`,
      }}
    />
  ),
  "Flower Bed": () => (
    <img
      src={ITEM_DETAILS["Flower Bed"].image}
      className="absolute bottom-0 h-auto w-full"
      style={{
        width: `${PIXEL_SCALE * 48}px`,
      }}
    />
  ),
  "Sunstone Rock": () => (
    <img
      src={ITEM_DETAILS["Sunstone Rock"].image}
      className="absolute h-auto w-full"
      style={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 1}px`,
        left: `${PIXEL_SCALE * 4}px`,
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
  "Crimstone Rock": Crimstone,
  Tree: Tree,
  "Fruit Patch": FruitPatch,
  Boulder: Boulder,
  Beehive: Beehive,
  "Flower Bed": FlowerBed,
  "Sunstone Rock": Sunstone,
  "Oil Reserve": () => null,
};

const isLandscaping = (state: MachineState) => state.matches("landscaping");
const _collectibles = (state: MachineState) => state.context.state.collectibles;
const _crops = (state: MachineState) => state.context.state.crops;
const _stones = (state: MachineState) => state.context.state.stones;
const _iron = (state: MachineState) => state.context.state.iron;
const _gold = (state: MachineState) => state.context.state.gold;

const LockedResource: React.FC<ResourceProps> = (props) => {
  const [showPopover, setShowPopover] = useState(false);

  const Component = RESOURCE_COMPONENTS[props.name];
  const { t } = useAppTranslation();

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >
      {showPopover && (
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * -15}px`,
          }}
        >
          <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
            <div className="flex items-center space-x-2 mx-1 p-1">
              <SquareIcon icon={lockIcon} width={5} />
              <span className="text-xxs mb-0.5">{t("aoe.locked")}</span>
            </div>
          </InnerPanel>
        </div>
      )}
      <div className="relative w-full h-full pointer-events-none">
        <Component {...props} />
      </div>
    </div>
  );
};

const MoveableResource: React.FC<ResourceProps> = (props) => {
  const Component = RESOURCE_COMPONENTS[props.name];

  return (
    <MoveableComponent x={props.x} y={props.y} {...(props as any)}>
      <Component {...props} />
    </MoveableComponent>
  );
};

const LandscapingResource: React.FC<ResourceProps> = (props) => {
  const { gameService } = useContext(Context);

  const collectibles = useSelector(gameService, _collectibles);
  const crops = useSelector(gameService, _crops);
  const stones = useSelector(gameService, _stones);
  const iron = useSelector(gameService, _iron);
  const gold = useSelector(gameService, _gold);

  const isResourceLocked = (): boolean => {
    const isPlot = props.name === "Crop Plot";
    const isStone = props.name === "Stone Rock";
    const isIron = props.name === "Iron Rock";
    const isGold = props.name === "Gold Rock";

    if (isPlot) {
      const plot = crops[props.id];
      return isPlotLocked(plot, collectibles, Date.now());
    }
    if (isStone) {
      const stoneRock = stones[props.id];
      return isStoneLocked(stoneRock, collectibles, Date.now());
    }
    if (isIron) {
      const ironRock = iron[props.id];
      return isIronLocked(ironRock, collectibles, Date.now());
    }
    if (isGold) {
      const goldRock = gold[props.id];
      return isGoldLocked(goldRock, collectibles, Date.now());
    }
    return false;
  };

  if (isResourceLocked()) return <LockedResource {...props} />;

  return <MoveableResource {...props} />;
};

const ResourceComponent: React.FC<ResourceProps> = (props) => {
  const { gameService } = useContext(Context);
  const landscaping = useSelector(gameService, isLandscaping);
  const Component = RESOURCE_COMPONENTS[props.name];

  if (landscaping) return <LandscapingResource {...props} />;

  return <Component {...props} />;
};

export const Resource = React.memo(ResourceComponent);
