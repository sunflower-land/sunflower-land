import bananaTree from "assets/fruit/banana/banana_tree.png";
import bananaTreeReady from "assets/fruit/banana/banana_tree_ready.png";
import lemonTree from "assets/fruit/lemon/lemonTree.webp";
import lemonTreeReady from "assets/fruit/lemon/lemonTreeReady.webp";
import tomatoPlant from "assets/fruit/tomato/tomatoPlant.webp";
import tomatoPlantReady from "assets/fruit/tomato/tomatoPlantReady.webp";
import duskberryBush from "assets/fruit/duskberry/duskberry_bush.webp";
import lunaraBush from "assets/fruit/lunara/lunara_bush.webp";
import celestineBush from "assets/fruit/celestine/celestine_bush.webp";

import { SUNNYSIDE } from "assets/sunnyside";
import { PatchFruitName } from "features/game/types/fruits";
import { CROP_LIFECYCLE } from "../plots/lib/plant";
import { IslandType } from "features/game/types/game";

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
  IslandType,
  Record<PatchFruitName, PatchFruitLifecycle>
> = {
  basic: {
    Apple: {
      seedling: CROP_LIFECYCLE.basic.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.basic.Sunflower.halfway,
      almost: CROP_LIFECYCLE.basic.Sunflower.almost,
      ready: SUNNYSIDE.fruit.apple_tree,
      harvested: SUNNYSIDE.fruit.harvestedTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Orange: {
      seedling: CROP_LIFECYCLE.basic.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.basic.Sunflower.halfway,
      almost: CROP_LIFECYCLE.basic.Sunflower.almost,
      ready: SUNNYSIDE.fruit.orangeTree,
      harvested: SUNNYSIDE.fruit.harvestedTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Blueberry: {
      seedling: CROP_LIFECYCLE.basic.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.basic.Sunflower.halfway,
      almost: CROP_LIFECYCLE.basic.Sunflower.almost,
      ready: SUNNYSIDE.fruit.blueberryBush,
      harvested: SUNNYSIDE.fruit.harvestedBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Banana: {
      seedling: CROP_LIFECYCLE.basic.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.basic.Sunflower.halfway,
      almost: CROP_LIFECYCLE.basic.Sunflower.almost,
      ready: bananaTreeReady,
      harvested: bananaTree,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Tomato: {
      seedling: CROP_LIFECYCLE.basic.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.basic.Sunflower.halfway,
      almost: CROP_LIFECYCLE.basic.Sunflower.almost,
      ready: tomatoPlantReady,
      harvested: tomatoPlant,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Lemon: {
      seedling: CROP_LIFECYCLE.basic.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.basic.Sunflower.halfway,
      almost: CROP_LIFECYCLE.basic.Sunflower.almost,
      ready: lemonTreeReady,
      harvested: lemonTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Celestine: {
      seedling: CROP_LIFECYCLE.basic.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.basic.Sunflower.halfway,
      almost: CROP_LIFECYCLE.basic.Sunflower.almost,
      ready: celestineBush,
      harvested: celestineBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Lunara: {
      seedling: CROP_LIFECYCLE.basic.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.basic.Sunflower.halfway,
      almost: CROP_LIFECYCLE.basic.Sunflower.almost,
      ready: lunaraBush,
      harvested: lunaraBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Duskberry: {
      seedling: CROP_LIFECYCLE.basic.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.basic.Sunflower.halfway,
      almost: CROP_LIFECYCLE.basic.Sunflower.almost,
      ready: duskberryBush,
      harvested: duskberryBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
  },
  spring: {
    Apple: {
      seedling: CROP_LIFECYCLE.spring.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.spring.Sunflower.halfway,
      almost: CROP_LIFECYCLE.spring.Sunflower.almost,
      ready: SUNNYSIDE.fruit.apple_tree,
      harvested: SUNNYSIDE.fruit.harvestedTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Orange: {
      seedling: CROP_LIFECYCLE.spring.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.spring.Sunflower.halfway,
      almost: CROP_LIFECYCLE.spring.Sunflower.almost,
      ready: SUNNYSIDE.fruit.orangeTree,
      harvested: SUNNYSIDE.fruit.harvestedTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Blueberry: {
      seedling: CROP_LIFECYCLE.spring.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.spring.Sunflower.halfway,
      almost: CROP_LIFECYCLE.spring.Sunflower.almost,
      ready: SUNNYSIDE.fruit.blueberryBush,
      harvested: SUNNYSIDE.fruit.harvestedBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Banana: {
      seedling: CROP_LIFECYCLE.spring.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.spring.Sunflower.halfway,
      almost: CROP_LIFECYCLE.spring.Sunflower.almost,
      ready: bananaTreeReady,
      harvested: bananaTree,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Tomato: {
      seedling: CROP_LIFECYCLE.spring.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.spring.Sunflower.halfway,
      almost: CROP_LIFECYCLE.spring.Sunflower.almost,
      ready: tomatoPlantReady,
      harvested: tomatoPlant,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Lemon: {
      seedling: CROP_LIFECYCLE.spring.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.spring.Sunflower.halfway,
      almost: CROP_LIFECYCLE.spring.Sunflower.almost,
      ready: lemonTreeReady,
      harvested: lemonTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Celestine: {
      seedling: CROP_LIFECYCLE.spring.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.spring.Sunflower.halfway,
      almost: CROP_LIFECYCLE.spring.Sunflower.almost,
      ready: celestineBush,
      harvested: celestineBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Lunara: {
      seedling: CROP_LIFECYCLE.spring.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.spring.Sunflower.halfway,
      almost: CROP_LIFECYCLE.spring.Sunflower.almost,
      ready: lunaraBush,
      harvested: lunaraBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Duskberry: {
      seedling: CROP_LIFECYCLE.spring.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.spring.Sunflower.halfway,
      almost: CROP_LIFECYCLE.spring.Sunflower.almost,
      ready: duskberryBush,
      harvested: duskberryBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
  },
  desert: {
    Apple: {
      seedling: CROP_LIFECYCLE.desert.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.desert.Sunflower.halfway,
      almost: CROP_LIFECYCLE.desert.Sunflower.almost,
      ready: SUNNYSIDE.fruit.apple_tree,
      harvested: SUNNYSIDE.fruit.harvestedTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Orange: {
      seedling: CROP_LIFECYCLE.desert.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.desert.Sunflower.halfway,
      almost: CROP_LIFECYCLE.desert.Sunflower.almost,
      ready: SUNNYSIDE.fruit.orangeTree,
      harvested: SUNNYSIDE.fruit.harvestedTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Blueberry: {
      seedling: CROP_LIFECYCLE.desert.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.desert.Sunflower.halfway,
      almost: CROP_LIFECYCLE.desert.Sunflower.almost,
      ready: SUNNYSIDE.fruit.blueberryBush,
      harvested: SUNNYSIDE.fruit.harvestedBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Banana: {
      seedling: CROP_LIFECYCLE.desert.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.desert.Sunflower.halfway,
      almost: CROP_LIFECYCLE.desert.Sunflower.almost,
      ready: bananaTreeReady,
      harvested: bananaTree,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Tomato: {
      seedling: CROP_LIFECYCLE.desert.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.desert.Sunflower.halfway,
      almost: CROP_LIFECYCLE.desert.Sunflower.almost,
      ready: tomatoPlantReady,
      harvested: tomatoPlant,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Lemon: {
      seedling: CROP_LIFECYCLE.desert.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.desert.Sunflower.halfway,
      almost: CROP_LIFECYCLE.desert.Sunflower.almost,
      ready: lemonTreeReady,
      harvested: lemonTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Celestine: {
      seedling: CROP_LIFECYCLE.desert.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.desert.Sunflower.halfway,
      almost: CROP_LIFECYCLE.desert.Sunflower.almost,
      ready: celestineBush,
      harvested: celestineBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Lunara: {
      seedling: CROP_LIFECYCLE.desert.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.desert.Sunflower.halfway,
      almost: CROP_LIFECYCLE.desert.Sunflower.almost,
      ready: lunaraBush,
      harvested: lunaraBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Duskberry: {
      seedling: CROP_LIFECYCLE.desert.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.desert.Sunflower.halfway,
      almost: CROP_LIFECYCLE.desert.Sunflower.almost,
      ready: duskberryBush,
      harvested: duskberryBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
  },
  volcano: {
    Apple: {
      seedling: CROP_LIFECYCLE.volcano.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.volcano.Sunflower.halfway,
      almost: CROP_LIFECYCLE.volcano.Sunflower.almost,
      ready: SUNNYSIDE.fruit.apple_tree,
      harvested: SUNNYSIDE.fruit.harvestedTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Orange: {
      seedling: CROP_LIFECYCLE.volcano.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.volcano.Sunflower.halfway,
      almost: CROP_LIFECYCLE.volcano.Sunflower.almost,
      ready: SUNNYSIDE.fruit.orangeTree,
      harvested: SUNNYSIDE.fruit.harvestedTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Blueberry: {
      seedling: CROP_LIFECYCLE.volcano.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.volcano.Sunflower.halfway,
      almost: CROP_LIFECYCLE.volcano.Sunflower.almost,
      ready: SUNNYSIDE.fruit.blueberryBush,
      harvested: SUNNYSIDE.fruit.harvestedBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Banana: {
      seedling: CROP_LIFECYCLE.volcano.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.volcano.Sunflower.halfway,
      almost: CROP_LIFECYCLE.volcano.Sunflower.almost,
      ready: bananaTreeReady,
      harvested: bananaTree,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Tomato: {
      seedling: CROP_LIFECYCLE.volcano.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.volcano.Sunflower.halfway,
      almost: CROP_LIFECYCLE.volcano.Sunflower.almost,
      ready: tomatoPlantReady,
      harvested: tomatoPlant,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Lemon: {
      seedling: CROP_LIFECYCLE.volcano.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.volcano.Sunflower.halfway,
      almost: CROP_LIFECYCLE.volcano.Sunflower.almost,
      ready: lemonTreeReady,
      harvested: lemonTree,
      dead: SUNNYSIDE.fruit.deadTree,
    },
    Celestine: {
      seedling: CROP_LIFECYCLE.volcano.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.volcano.Sunflower.halfway,
      almost: CROP_LIFECYCLE.volcano.Sunflower.almost,
      ready: celestineBush,
      harvested: celestineBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Lunara: {
      seedling: CROP_LIFECYCLE.volcano.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.volcano.Sunflower.halfway,
      almost: CROP_LIFECYCLE.volcano.Sunflower.almost,
      ready: lunaraBush,
      harvested: lunaraBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
    Duskberry: {
      seedling: CROP_LIFECYCLE.volcano.Sunflower.seedling,
      halfway: CROP_LIFECYCLE.volcano.Sunflower.halfway,
      almost: CROP_LIFECYCLE.volcano.Sunflower.almost,
      ready: duskberryBush,
      harvested: duskberryBush,
      dead: SUNNYSIDE.fruit.bushShrub,
    },
  },
};
