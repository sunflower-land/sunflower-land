import bananaTree from "assets/fruit/banana/banana_tree.png";
import bananaTreeReady from "assets/fruit/banana/banana_tree_ready.png";
import lemonTree from "assets/fruit/lemon/lemonTree.webp";
import lemonTreeReady from "assets/fruit/lemon/lemonTreeReady.webp";
import tomatoPlant from "assets/fruit/tomato/tomatoPlant.webp";
import tomatoPlantReady from "assets/fruit/tomato/tomatoPlantReady.webp";

import { SUNNYSIDE } from "assets/sunnyside";
import { PatchFruitName } from "features/game/types/fruits";
import { PLOT_CROP_LIFECYCLE } from "../plots/lib/plant";

export type PatchFruitLifecycle = {
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
export const PATCH_FRUIT_LIFECYCLE: Record<
  PatchFruitName,
  PatchFruitLifecycle
> = {
  Apple: {
    seedling: PLOT_CROP_LIFECYCLE.Sunflower.seedling,
    halfway: PLOT_CROP_LIFECYCLE.Sunflower.halfway,
    almost: PLOT_CROP_LIFECYCLE.Sunflower.almost,
    ready: SUNNYSIDE.fruit.apple_tree,
    harvested: SUNNYSIDE.fruit.harvestedTree,
    dead: SUNNYSIDE.fruit.deadTree,
  },
  Orange: {
    seedling: PLOT_CROP_LIFECYCLE.Sunflower.seedling,
    halfway: PLOT_CROP_LIFECYCLE.Sunflower.halfway,
    almost: PLOT_CROP_LIFECYCLE.Sunflower.almost,
    ready: SUNNYSIDE.fruit.orangeTree,
    harvested: SUNNYSIDE.fruit.harvestedTree,
    dead: SUNNYSIDE.fruit.deadTree,
  },
  Blueberry: {
    seedling: PLOT_CROP_LIFECYCLE.Sunflower.seedling,
    halfway: PLOT_CROP_LIFECYCLE.Sunflower.halfway,
    almost: PLOT_CROP_LIFECYCLE.Sunflower.almost,
    ready: SUNNYSIDE.fruit.blueberryBush,
    harvested: SUNNYSIDE.fruit.harvestedBush,
    dead: SUNNYSIDE.fruit.bushShrub,
  },
  Banana: {
    seedling: PLOT_CROP_LIFECYCLE.Sunflower.seedling,
    halfway: PLOT_CROP_LIFECYCLE.Sunflower.halfway,
    almost: PLOT_CROP_LIFECYCLE.Sunflower.almost,
    ready: bananaTreeReady,
    harvested: bananaTree,
    dead: SUNNYSIDE.fruit.bushShrub,
  },
  Tomato: {
    seedling: PLOT_CROP_LIFECYCLE.Sunflower.seedling,
    halfway: PLOT_CROP_LIFECYCLE.Sunflower.halfway,
    almost: PLOT_CROP_LIFECYCLE.Sunflower.almost,
    ready: tomatoPlantReady,
    harvested: tomatoPlant,
    dead: SUNNYSIDE.fruit.bushShrub,
  },
  Lemon: {
    seedling: PLOT_CROP_LIFECYCLE.Sunflower.seedling,
    halfway: PLOT_CROP_LIFECYCLE.Sunflower.halfway,
    almost: PLOT_CROP_LIFECYCLE.Sunflower.almost,
    ready: lemonTreeReady,
    harvested: lemonTree,
    dead: SUNNYSIDE.fruit.deadTree,
  },
};
