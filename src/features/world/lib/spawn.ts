import type { Coordinates } from "features/game/expansion/components/MapPlacement";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import type { SceneId } from "../mmoMachine";

// `"default"` is a sentinel WorldMap callers use to mean "always use the
// scene's `default` spawn", overriding the auto-derived previous scene.
// `"digging"` is a non-scene shortcut that maps to a specific beach spawn.
export type SpawnFromId = SceneId | "digging" | "default";

export type SpawnLocation = Record<
  SceneId,
  { default: Coordinates } & Partial<Record<SpawnFromId, Coordinates>>
>;

const randomXOffset = Math.random() * 60;
const randomYOffset = Math.random() * 20;

const TILE_SIZE = 16;

/** Tile the plaza statue stands on in `seasonal_plaza.json`. */
const PLAZA_STATUE_TILE: Coordinates = { x: 26, y: 19 };

/**
 * How many tiles either side of the statue a player can land on - so the spawn
 * area is the 7x7 block of tiles centred on the statue (before, after, above,
 * below and diagonally out to three tiles).
 */
const PLAZA_SPAWN_TILE_RADIUS = 3;

/**
 * Tiles inside that block that are not walkable: the statue's own footprint
 * (plus the tile to its left, which the player's body clips into) and the
 * fenced strip running down the left hand edge of the block.
 */
const PLAZA_BLOCKED_SPAWN_TILES = [
  "25,18",
  "25,19",
  "26,18",
  "26,19",
  "26,20",
  "27,18",
  "27,19",
  "27,20",
  "23,16",
  "23,17",
  "23,22",
];

export const PLAZA_STATUE_SPAWN_TILES: Coordinates[] = (() => {
  const tiles: Coordinates[] = [];

  for (
    let x = PLAZA_STATUE_TILE.x - PLAZA_SPAWN_TILE_RADIUS;
    x <= PLAZA_STATUE_TILE.x + PLAZA_SPAWN_TILE_RADIUS;
    x++
  ) {
    for (
      let y = PLAZA_STATUE_TILE.y - PLAZA_SPAWN_TILE_RADIUS;
      y <= PLAZA_STATUE_TILE.y + PLAZA_SPAWN_TILE_RADIUS;
      y++
    ) {
      if (PLAZA_BLOCKED_SPAWN_TILES.includes(`${x},${y}`)) continue;

      tiles.push({ x, y });
    }
  }

  return tiles;
})();

// Picked once per session so every caller (the mmo machine's join payload and
// the scene that actually creates the player) agrees on where we spawned.
const randomPlazaStatueSpawn =
  PLAZA_STATUE_SPAWN_TILES[
    Math.floor(Math.random() * PLAZA_STATUE_SPAWN_TILES.length)
  ];

/** Below this level players still spawn in the bottom section of the plaza. */
const PLAZA_STATUE_SPAWN_LEVEL = 5;

export const SPAWNS: (experience?: number) => SpawnLocation = (
  experience = 0,
) => ({
  love_island: {
    default: {
      x: 608,
      y: 770,
    },
  },
  stream: {
    default: {
      x: 240,
      y: 180,
    },
  },
  infernos: {
    default: {
      x: 318,
      y: 412,
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
    // Low level players keep spawning in the bottom section (close to the
    // tutorial NPCs), everyone else is scattered around the central statue so
    // they don't clump up on the one spot.
    default:
      experience < LEVEL_EXPERIENCE[PLAZA_STATUE_SPAWN_LEVEL]
        ? {
            x: 400 + randomXOffset,
            y: 450 - randomYOffset,
          }
        : {
            x: randomPlazaStatueSpawn.x * TILE_SIZE + TILE_SIZE / 2,
            y: randomPlazaStatueSpawn.y * TILE_SIZE + TILE_SIZE / 2,
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
    digging: {
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
  // Giveaway race: left-hand side of the run.json map, in the middle 8-tile
  // lane (the top and bottom 8 rows are trees).
  giveaway_race: {
    default: {
      x: 32,
      y: 192,
    },
  },
  // Log Chop: centre of the woodlands map — trees are scattered around here.
  giveaway_chop: {
    default: {
      x: 400,
      y: 208,
    },
  },
  // Jumper: everyone starts on the same base line and climbs straight up from
  // here (lower on the map so there's headroom above to rise into).
  giveaway_jump: {
    default: {
      x: 400,
      y: 340,
    },
  },
  // Trivia: shared centre — the four answer columns fan out either side, and the
  // players cluster just above this line.
  giveaway_trivia: {
    default: {
      x: 400,
      y: 240,
    },
  },
  // Pumpkin Pop: you stand in the middle of the patch and the other growers'
  // plots are laid out in a grid around you, so there needs to be room on all
  // four sides.
  giveaway_pop: {
    default: {
      x: 400,
      y: 208,
    },
  },
});
