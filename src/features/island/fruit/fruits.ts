import sunflowerSeedling from "assets/crops/sunflower/seedling.png";
import sunflowerHalfway from "assets/crops/sunflower/halfway.png";
import sunflowerAlmostDone from "assets/crops/sunflower/almost.png";
import appleTree from "assets/fruit/apple/apple_tree.png";
import orangeTree from "assets/fruit/orange/orange_tree.png";
import blueberryBush from "assets/fruit/blueberry/blueberry_bush.png";
import harvestedTree from "assets/fruit/harvested_tree.png";
import harvestedBush from "assets/fruit/harvested_bush.png";
import deadTree from "assets/fruit/dead_tree.webp";
import bushShrub from "assets/fruit/bush_shrub.png";
import { FruitName } from "features/game/types/fruits";

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
    seedling: sunflowerSeedling,
    halfway: sunflowerHalfway,
    almost: sunflowerAlmostDone,
    ready: appleTree,
    harvested: harvestedTree,
    dead: deadTree,
  },
  Orange: {
    seedling: sunflowerSeedling,
    halfway: sunflowerHalfway,
    almost: sunflowerAlmostDone,
    ready: orangeTree,
    harvested: harvestedTree,
    dead: deadTree,
  },
  Blueberry: {
    seedling: sunflowerSeedling,
    halfway: sunflowerHalfway,
    almost: sunflowerAlmostDone,
    ready: blueberryBush,
    harvested: harvestedBush,
    dead: bushShrub,
  },
};
