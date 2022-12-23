import { Lifecycle } from "features/farming/crops/lib/plant";
import { FruitName } from "./FruitPatch";
import sunflowerSeedling from "assets/crops/sunflower/seedling.png";
import sunflowerHalfway from "assets/crops/sunflower/halfway.png";
import sunflowerAlmostDone from "assets/crops/sunflower/almost.png";
import appleTree from "assets/fruit/apple/apple_tree.png";
import orangeTree from "assets/fruit/orange/orange_tree.png";
import blueberryBush from "assets/fruit/blueberry/blueberry_bush.png";

/**
 * Fruits and their original prices
 * TODO - use crop name from GraphQL API
 */
export const FRUIT_LIFECYCLE: Record<FruitName, Lifecycle> = {
  Apple: {
    seedling: sunflowerSeedling,
    halfway: sunflowerHalfway,
    almost: sunflowerAlmostDone,
    ready: appleTree,
  },
  Orange: {
    seedling: sunflowerSeedling,
    halfway: sunflowerHalfway,
    almost: sunflowerAlmostDone,
    ready: orangeTree,
  },
  Blueberry: {
    seedling: sunflowerSeedling,
    halfway: sunflowerHalfway,
    almost: sunflowerAlmostDone,
    ready: blueberryBush,
  },
};
