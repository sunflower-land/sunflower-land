import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { SceneId } from "../mmoMachine";

export type SpawnLocation = Record<
  SceneId,
  { default: Coordinates } & Partial<Record<SceneId, Coordinates>>
>;

const randomXOffset = Math.random() * 60;
const randomYOffset = Math.random() * 20;

export const SPAWNS: () => SpawnLocation = () => ({
  phaser_preloader_scene: {
    default: {
      x: 400 + randomXOffset,
      y: 450 - randomYOffset,
    },
  },
  portal_example: {
    default: {
      x: 400 + randomXOffset,
      y: 450 - randomYOffset,
    },
  },
  goblin_house: {
    default: {
      x: 239,
      y: 436,
    },
  },
  sunflorian_house: {
    default: {
      x: 239,
      y: 432,
    },
  },
  nightshade_house: {
    default: {
      x: 240,
      y: 432,
    },
  },
  bumpkin_house: {
    default: {
      x: 240,
      y: 434,
    },
  },
  faction_house: {
    // Make sure everyone doesn't spawn in same spot
    default: {
      x: 230 + randomXOffset,
      y: 420 - randomYOffset,
    },
  },
  kingdom: {
    // Make sure everyone doesn't spawn in same spot
    default: {
      x: 235,
      y: 845,
    },
    beach: {
      x: 25,
      y: 656,
    },
    nightshade_house: {
      x: 120,
      y: 448,
    },
    sunflorian_house: {
      x: 344,
      y: 651,
    },
    goblin_house: {
      x: 122,
      y: 786,
    },
    bumpkin_house: {
      x: 376,
      y: 462,
    },
  },
  retreat: {
    // Make sure everyone doesn't spawn in same spot
    default: {
      x: 290 + randomXOffset,
      y: 420 - randomYOffset,
    },
  },
  plaza: {
    // Make sure everyone doesn't spawn in same spot
    default: {
      x: 400 + randomXOffset,
      y: 450 - randomYOffset,
    },

    kingdom: {
      x: 64,
      y: 35,
    },

    woodlands: {
      x: 850,
      y: 142,
    },
    beach: {
      x: 26,
      y: 318,
    },
  },
  crop_boom: {
    default: {
      x: 220,
      y: 422,
    },
  },
  mushroom_forest: {
    default: {
      x: 220,
      y: 422,
    },
  },
  beach: {
    default: {
      x: 528,
      y: 736,
    },
    kingdom: {
      x: 532,
      y: 257,
    },
  },

  auction_house: {
    default: {
      x: 170,
      y: 242,
    },
  },
  clothes_shop: {
    default: {
      x: 144,
      y: 245,
    },
  },
  decorations_shop: {
    default: {
      x: 81,
      y: 215,
    },
  },
  windmill_floor: {
    default: {
      x: 80,
      y: 140,
    },
  },
  woodlands: {
    default: {
      x: 30,
      y: 290,
    },
  },
  examples_animations: {
    default: {
      x: 400 + randomXOffset,
      y: 450 - randomYOffset,
    },
  },
  examples_rpg: {
    default: {
      x: 400 + randomXOffset,
      y: 450 - randomYOffset,
    },
  },
});
