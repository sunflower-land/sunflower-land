import React from "react";

import { BuildingName } from "features/game/types/buildings";
import { FirePit } from "./firePit/FirePit";
import { WithCraftingMachine } from "./WithCraftingMachine";
import { Market } from "./market/Market";
import { WorkBench } from "./workBench/WorkBench";
import { Tent } from "./tent/Tent";
import { WaterWell } from "./waterWell/WaterWell";
import { ChickenHouse } from "./henHouse/HenHouse";
import { Bakery } from "./bakery/Bakery";

import { Kitchen } from "./kitchen/Kitchen";
import { Deli } from "./deli/Deli";

import { SmoothieShack } from "./smoothieShack/SmoothieShack";
import { Warehouse } from "./warehouse/Warehouse";
import { Toolshed } from "./toolshed/Toolshed";
import { TownCenter } from "./townCenter/TownCenter";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { CookableName } from "features/game/types/consumables";
import { Composter } from "./composters/Composter";
import { House } from "./house/House";
import { Manor } from "./manor/Manor";
import { IslandType } from "features/game/types/game";
import {
  BAKERY_VARIANTS,
  DELI_VARIANTS,
  FIRE_PIT_VARIANTS,
  HEN_HOUSE_VARIANTS,
  KITCHEN_VARIANTS,
  MARKET_VARIANTS,
  SMOOTHIE_SHACK_VARIANTS,
  WORKBENCH_VARIANTS,
} from "features/island/lib/alternateArt";

import { Greenhouse } from "./greenhouse/Greenhouse";

export interface BuildingProps {
  buildingId: string;
  buildingIndex: number;
  island: IslandType;
  craftingItemName?: CookableName;
  craftingReadyAt?: number;
  isBuilt?: boolean;
}

export const BUILDING_COMPONENTS: Record<
  BuildingName,
  React.FC<BuildingProps>
> = {
  "Fire Pit": ({
    buildingId,
    buildingIndex,
    craftingItemName,
    craftingReadyAt,
    isBuilt,
    island,
  }: BuildingProps) => (
    <WithCraftingMachine
      buildingId={buildingId}
      buildingIndex={buildingIndex}
      craftingItemName={craftingItemName}
      craftingReadyAt={craftingReadyAt}
      island={island}
    >
      <FirePit
        buildingId={buildingId}
        buildingIndex={buildingIndex}
        isBuilt={isBuilt}
        island={island}
      />
    </WithCraftingMachine>
  ),
  Workbench: WorkBench,
  Bakery: ({
    buildingId,
    buildingIndex,
    craftingItemName,
    craftingReadyAt,
    isBuilt,
    island,
  }: BuildingProps) => (
    <WithCraftingMachine
      buildingId={buildingId}
      buildingIndex={buildingIndex}
      craftingItemName={craftingItemName}
      craftingReadyAt={craftingReadyAt}
      island={island}
    >
      <Bakery
        buildingId={buildingId}
        buildingIndex={buildingIndex}
        isBuilt={isBuilt}
        island={island}
      />
    </WithCraftingMachine>
  ),
  Market: Market,
  Tent: Tent,
  "Town Center": TownCenter,
  House: House,
  "Water Well": WaterWell,
  Warehouse: Warehouse,
  Toolshed: Toolshed,
  "Hen House": ChickenHouse,
  Kitchen: ({
    buildingId,
    buildingIndex,
    craftingItemName,
    craftingReadyAt,
    isBuilt,
    island,
  }: BuildingProps) => (
    <WithCraftingMachine
      buildingId={buildingId}
      buildingIndex={buildingIndex}
      craftingItemName={craftingItemName}
      craftingReadyAt={craftingReadyAt}
      island={island}
    >
      <Kitchen
        buildingId={buildingId}
        buildingIndex={buildingIndex}
        isBuilt={isBuilt}
        island={island}
      />
    </WithCraftingMachine>
  ),
  Deli: ({
    buildingId,
    buildingIndex,
    craftingItemName,
    craftingReadyAt,
    isBuilt,
    island,
  }: BuildingProps) => (
    <WithCraftingMachine
      buildingId={buildingId}
      buildingIndex={buildingIndex}
      craftingItemName={craftingItemName}
      craftingReadyAt={craftingReadyAt}
      island={island}
    >
      <Deli
        buildingId={buildingId}
        buildingIndex={buildingIndex}
        isBuilt={isBuilt}
        island={island}
      />
    </WithCraftingMachine>
  ),
  "Smoothie Shack": ({
    buildingId,
    buildingIndex,
    craftingItemName,
    craftingReadyAt,
    isBuilt,
    island,
  }: BuildingProps) => (
    <WithCraftingMachine
      buildingId={buildingId}
      buildingIndex={buildingIndex}
      craftingItemName={craftingItemName}
      craftingReadyAt={craftingReadyAt}
      island={island}
    >
      <SmoothieShack
        buildingId={buildingId}
        buildingIndex={buildingIndex}
        isBuilt={isBuilt}
        island={island}
      />
    </WithCraftingMachine>
  ),
  "Compost Bin": () => <Composter name="Compost Bin" />,
  "Turbo Composter": () => <Composter name="Turbo Composter" />,
  "Premium Composter": () => <Composter name="Premium Composter" />,
  Manor: Manor,
  Greenhouse: Greenhouse,
};

export const READONLY_BUILDINGS: (
  island: IslandType
) => Record<BuildingName, React.FC<any>> = (island) => ({
  ...BUILDING_COMPONENTS,
  "Fire Pit": () => (
    <img
      src={FIRE_PIT_VARIANTS[island]}
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 47}px` }}
    />
  ),
  Kitchen: () => (
    <img
      src={KITCHEN_VARIANTS[island]}
      className="absolute"
      style={{ width: `${PIXEL_SCALE * 63}px`, bottom: 0 }}
    />
  ),
  Workbench: () => (
    <img
      src={WORKBENCH_VARIANTS[island]}
      className="relative"
      style={{
        width: `${PIXEL_SCALE * 47}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
      }}
    />
  ),
  Market: () => (
    <img
      src={MARKET_VARIANTS[island]}
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 48}px` }}
    />
  ),
  "Hen House": () => (
    <img
      src={HEN_HOUSE_VARIANTS[island]}
      className="absolute"
      style={{ width: `${PIXEL_SCALE * 61}px`, bottom: 0 }}
    />
  ),
  "Town Center": () => (
    <img
      src={ITEM_DETAILS["Town Center"].image}
      className="relative"
      style={{
        width: `${PIXEL_SCALE * 62}px`,
        left: `${PIXEL_SCALE * 2}px`,
        bottom: `${PIXEL_SCALE * 11}px`,
      }}
    />
  ),
  "Smoothie Shack": () => (
    <img
      src={SMOOTHIE_SHACK_VARIANTS[island]}
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 48}px` }}
    />
  ),
  Bakery: () => (
    <img
      src={BAKERY_VARIANTS[island]}
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 62}px`, left: `${PIXEL_SCALE * 1}px` }}
    />
  ),
  Deli: () => (
    <img
      src={DELI_VARIANTS[island]}
      className="absolute bottom-0"
      style={{ width: `${PIXEL_SCALE * 64}px` }}
    />
  ),

  "Compost Bin": () => (
    <div
      className="absolute bottom-0"
      style={{
        width: `${PIXEL_SCALE * 24}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Compost Bin"].image}
        className="w-full absolute"
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 2}px`,
        }}
      />
    </div>
  ),
  "Turbo Composter": () => (
    <div
      className="absolute bottom-0"
      style={{
        width: `${PIXEL_SCALE * 27}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Turbo Composter"].image}
        className="w-full absolute"
        style={{
          width: `${PIXEL_SCALE * 27}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
        }}
      />
    </div>
  ),
  "Premium Composter": () => (
    <div
      className="absolute bottom-0"
      style={{
        width: `${PIXEL_SCALE * 34}px`,
        bottom: `${PIXEL_SCALE * 0}px`,
        left: `${PIXEL_SCALE * 2}px`,
      }}
    >
      <img
        src={ITEM_DETAILS["Premium Composter"].image}
        className="w-full absolute"
        style={{
          width: `${PIXEL_SCALE * 34}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -3}px`,
        }}
      />
    </div>
  ),
});
