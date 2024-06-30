import firePit from "public/assets/buildings/fire_pit.png";
import desertFirePit from "public/assets/desert/buildings/fire_pit.webp";

import bakery from "public/assets/buildings/bakery.png";
import desertBakery from "public/assets/desert/buildings/bakery.webp";

import deli from "public/assets/buildings/deli.png";
import desertDeli from "public/assets/desert/buildings/deli.webp";

import building from "public/assets/buildings/hen_house.png";
import desertBuilding from "public/assets/desert/buildings/hen_house.webp";

import kitchen from "public/assets/buildings/kitchen.png";
import desertKitchen from "public/assets/desert/buildings/kitchen.webp";

import house from "public/assets/buildings/manor.png";
import desertHouse from "public/assets/desert/buildings/manor.webp";

import market from "public/assets/buildings/bettys_market.png";
import desertMarket from "public/assets/desert/buildings/bettys_market.webp";

import smoothieShack from "public/assets/buildings/smoothie_shack_background.webp";
import desertSmoothieShack from "public/assets/desert/buildings/smoothie_shack_background.webp";

import workbench from "public/assets/buildings/workbench.png";
import desertWorkbench from "public/assets/desert/buildings/workbench.webp";

import fruitPatchDirt from "public/assets/fruit/fruit_patch.png";
import desertFruitPatchDirt from "public/assets/desert/fruit/fruit_patch.webp";

import emptyFlowerBed from "public/assets/flowers/empty.webp";
import desertEmptyFlowerBed from "public/assets/desert/flowers/empty.webp";

import dirt from "public/assets/sfts/dirt_path.png";
import desertDirt from "public/assets/desert/sfts/dirt_path.webp";

import { IslandType } from "features/game/types/game";

export const FIRE_PIT_VARIANTS: Record<IslandType, string> = {
  basic: firePit,
  spring: firePit,
  desert: desertFirePit,
};

export const BAKERY_VARIANTS: Record<IslandType, string> = {
  basic: bakery,
  spring: bakery,
  desert: desertBakery,
};

export const DELI_VARIANTS: Record<IslandType, string> = {
  basic: deli,
  spring: deli,
  desert: desertDeli,
};

export const HEN_HOUSE_VARIANTS: Record<IslandType, string> = {
  basic: building,
  spring: building,
  desert: desertBuilding,
};

export const KITCHEN_VARIANTS: Record<IslandType, string> = {
  basic: kitchen,
  spring: kitchen,
  desert: desertKitchen,
};

export const MANOR_VARIANTS: Record<IslandType, string> = {
  basic: house,
  spring: house,
  desert: desertHouse,
};

export const MARKET_VARIANTS: Record<IslandType, string> = {
  basic: market,
  spring: market,
  desert: desertMarket,
};

export const SMOOTHIE_SHACK_VARIANTS: Record<IslandType, string> = {
  basic: smoothieShack,
  spring: smoothieShack,
  desert: desertSmoothieShack,
};

export const WORKBENCH_VARIANTS: Record<IslandType, string> = {
  basic: workbench,
  spring: workbench,
  desert: desertWorkbench,
};

export const FRUIT_PATCH_VARIANTS: Record<IslandType, string> = {
  basic: fruitPatchDirt,
  spring: fruitPatchDirt,
  desert: desertFruitPatchDirt,
};

export const FLOWER_VARIANTS: Record<IslandType, string> = {
  basic: emptyFlowerBed,
  spring: emptyFlowerBed,
  desert: desertEmptyFlowerBed,
};

export const DIRT_PATH_VARIANTS: Record<IslandType, string> = {
  basic: dirt,
  spring: dirt,
  desert: desertDirt,
};
