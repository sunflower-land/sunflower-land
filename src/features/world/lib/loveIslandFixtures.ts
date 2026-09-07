/**
 * Solid things the Love Island scene adds on top of the map - they aren't in
 * the map's `Collision` layer, so `_scripts/loveIslandTiles.ts` reads them
 * from here to keep the walkable tiles honest. Keep this file free of
 * imports: the generator runs it under node.
 */

/**
 * The Love Boulder sits at the very top of the island, at the foot of the
 * cliff where the path dead-ends. Art is 26x25; its base rests on the dirt.
 */
export const LOVE_BOULDER_SPOT = { x: 620, y: 362 };
export const LOVE_BOULDER_WIDTH = 26;
export const LOVE_BOULDER_HEIGHT = 25;
/**
 * Clear ground kept around the Love Boulder. Without it the crowd stands on
 * top of the boulder and nobody can see it; the collider is the art plus
 * this buffer on every side, so miners gather around its edge.
 */
export const LOVE_BOULDER_BUFFER = 8;

export type LoveIslandFixture = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * Every fixture's collider, top-left and size in world px. A Lover's Push
 * boulder can't roll over any tile these touch, and no boulder starts where
 * one blocks the pusher - a heart parked under the Love Boulder would be
 * stuck for good, since nobody can stand there to push it back out.
 */
export const LOVE_ISLAND_FIXTURES: LoveIslandFixture[] = [
  {
    x: LOVE_BOULDER_SPOT.x - LOVE_BOULDER_WIDTH / 2 - LOVE_BOULDER_BUFFER,
    y: LOVE_BOULDER_SPOT.y - LOVE_BOULDER_HEIGHT / 2 - LOVE_BOULDER_BUFFER,
    width: LOVE_BOULDER_WIDTH + LOVE_BOULDER_BUFFER * 2,
    height: LOVE_BOULDER_HEIGHT + LOVE_BOULDER_BUFFER * 2,
  },
];
