import firePit from "assets/buildings/fire_pit.png";
import desertFirePit from "assets/desert/buildings/fire_pit.webp";

import bakery from "assets/buildings/bakery.png";
import desertBakery from "assets/desert/buildings/bakery.webp";

import deli from "assets/buildings/deli.png";
import desertDeli from "assets/desert/buildings/deli.webp";

import building from "assets/buildings/hen_house.png";
import desertBuilding from "assets/desert/buildings/hen_house.webp";

import kitchen from "assets/buildings/kitchen.png";
import desertKitchen from "assets/desert/buildings/kitchen.webp";

import house from "assets/buildings/manor.png";
import desertHouse from "assets/desert/buildings/manor.webp";

import market from "assets/buildings/bettys_market.png";
import desertMarket from "assets/desert/buildings/bettys_market.webp";

import smoothieShack from "assets/buildings/smoothie_shack_background.webp";
import desertSmoothieShack from "assets/desert/buildings/smoothie_shack_background.webp";

import workbench from "assets/buildings/workbench.png";
import desertWorkbench from "assets/desert/buildings/workbench.webp";

import fruitPatchDirt from "assets/fruit/fruit_patch.png";
import desertFruitPatchDirt from "assets/desert/fruit/fruit_patch.webp";

import emptyFlowerBed from "assets/flowers/empty.webp";
import desertEmptyFlowerBed from "assets/desert/flowers/empty.webp";

import dirt from "assets/sfts/dirt_path.png";
import desertDirt from "assets/desert/sfts/dirt_path.webp";

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
