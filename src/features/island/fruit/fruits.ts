import appleTree from "assets/fruit/apple/apple_tree.png";
import orangeTree from "assets/fruit/orange/orange_tree.png";
import blueberryBush from "assets/fruit/blueberry/blueberry_bush.png";
import bananaTree from "assets/fruit/banana/banana_tree.png";
import bananaTreeReady from "assets/fruit/banana/banana_tree_ready.png";
import harvestedTree from "assets/fruit/harvested_tree.png";
import harvestedBush from "assets/fruit/harvested_bush.png";
import deadTree from "assets/fruit/dead_tree.webp";
import bushShrub from "assets/fruit/bush_shrub.png";
import { FruitName } from "features/game/types/fruits";
import { CROP_LIFECYCLE } from "../plots/lib/plant";

export type FruitLifecycle = {
  seedling: string;
  halfway: string;
  almost: string;
  ready: string;
  harvested: string;
  dead: string;
};

/**
 * Fruits and their original prices
 * TODO - Replace deadTree images with the correct images
 */
export const FRUIT_LIFECYCLE: Record<FruitName, FruitLifecycle> = {
  Apple: {
    seedling: CROP_LIFECYCLE.Sunflower.seedling,
    halfway: CROP_LIFECYCLE.Sunflower.halfway,
    almost: CROP_LIFECYCLE.Sunflower.almost,
    ready: appleTree,
    harvested: harvestedTree,
    dead: deadTree,
  },
  Orange: {
    seedling: CROP_LIFECYCLE.Sunflower.seedling,
    halfway: CROP_LIFECYCLE.Sunflower.halfway,
    almost: CROP_LIFECYCLE.Sunflower.almost,
    ready: orangeTree,
    harvested: harvestedTree,
    dead: deadTree,
  },
  Blueberry: {
    seedling: CROP_LIFECYCLE.Sunflower.seedling,
    halfway: CROP_LIFECYCLE.Sunflower.halfway,
    almost: CROP_LIFECYCLE.Sunflower.almost,
    ready: blueberryBush,
    harvested: harvestedBush,
    dead: bushShrub,
  },
  Banana: {
    seedling: CROP_LIFECYCLE.Sunflower.seedling,
    halfway: CROP_LIFECYCLE.Sunflower.halfway,
    almost: CROP_LIFECYCLE.Sunflower.almost,
    ready: bananaTreeReady,
    harvested: bananaTree,
    dead: bushShrub,
  },
};
