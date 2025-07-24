import React, { useContext } from "react";

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
import { Crimstone } from "features/game/expansion/components/resources/crimstone/Crimstone";
import { Beehive } from "features/game/expansion/components/resources/beehive/Beehive";
import { FlowerBed } from "../flowers/FlowerBed";
import { Sunstone } from "features/game/expansion/components/resources/sunstone/Sunstone";
import { OilReserve } from "features/game/expansion/components/resources/oilReserve/OilReserve";
import { GameState, TemperateSeasonName } from "features/game/types/game";

import { LavaPit } from "features/game/expansion/components/lavaPit/LavaPit";
import { TREE_VARIANTS } from "../lib/alternateArt";
import { getCurrentBiome } from "../biomes/biomes";

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
export const READONLY_RESOURCE_COMPONENTS: (
  island: GameState["island"],
  season: TemperateSeasonName,
) => Record<ResourceName, React.FC<ResourceProps>> = (island, season) => {
  const currentBiome = getCurrentBiome(island);
  return {
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
          width: `${PIXEL_SCALE * 24}px`,
          top: `${PIXEL_SCALE * 3}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
      />
    ),
    "Oil Reserve": () => (
      <img
        src={ITEM_DETAILS["Oil Reserve"].image}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${PIXEL_SCALE * 30}px`,
        }}
      />
    ),
    Tree: () => (
      <img
        src={TREE_VARIANTS[currentBiome][season]}
        className="relative"
        style={{
          width: `${PIXEL_SCALE * 26}px`,
          bottom: `${PIXEL_SCALE * 3}px`,
          left: `${PIXEL_SCALE * 3}px`,
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
    "Lava Pit": () => (
      <img
        src={ITEM_DETAILS["Lava Pit"].image}
        className="absolute h-auto w-full"
      />
    ),
  };
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
  "Oil Reserve": OilReserve,
  "Lava Pit": LavaPit,
};

const isLandscaping = (state: MachineState) => state.matches("landscaping");

const MoveableResource: React.FC<ResourceProps> = (props) => {
  const Component = RESOURCE_COMPONENTS[props.name];

  return (
    <MoveableComponent x={props.x} y={props.y} {...(props as any)}>
      <Component {...props} />
    </MoveableComponent>
  );
};

const LandscapingResource: React.FC<ResourceProps> = (props) => {
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
