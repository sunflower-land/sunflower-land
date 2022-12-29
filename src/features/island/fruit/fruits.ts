import sunflowerSeedling from "assets/crops/sunflower/seedling.png";
import sunflowerHalfway from "assets/crops/sunflower/halfway.png";
import sunflowerAlmostDone from "assets/crops/sunflower/almost.png";
import appleTree from "assets/fruit/apple/apple_tree.png";
import orangeTree from "assets/fruit/orange/orange_tree.png";
import blueberryBush from "assets/fruit/blueberry/blueberry_bush.png";
import harvestedTree from "assets/fruit/harvested_tree.webp";
import harvestedBush from "assets/fruit/harvested_bush.webp";
import { FruitName } from "features/game/types/fruits";

export type FruitLifecycle = {
  seedling: any;
  halfway: any;
  almost: any;
  ready: any;
  harvested: any;
};

/**
 * Fruits and their original prices
 * TODO - use crop name from GraphQL API
 */
export const FRUIT_LIFECYCLE: Record<FruitName, FruitLifecycle> = {
  Apple: {
    seedling: sunflowerSeedling,
    halfway: sunflowerHalfway,
    almost: sunflowerAlmostDone,
    ready: appleTree,
    harvested: harvestedTree,
  },
  Orange: {
    seedling: sunflowerSeedling,
    halfway: sunflowerHalfway,
    almost: sunflowerAlmostDone,
    ready: orangeTree,
    harvested: harvestedTree,
  },
  Blueberry: {
    seedling: sunflowerSeedling,
    halfway: sunflowerHalfway,
    almost: sunflowerAlmostDone,
    ready: blueberryBush,
    harvested: harvestedBush,
  },
};
