import fs from "fs";
import path from "path";
import { LEVEL_EXPERIENCE } from "features/game/lib/level";
import { PLAZA_STATUE_SPAWN_TILES, SPAWNS } from "./spawn";

const TILE_SIZE = 16;

type CollisionObject = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// The map is aliased away by jest's `assets/` moduleNameMapper, so read it off
// disk instead.
const plazaCollisions: CollisionObject[] = (() => {
  const map = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../../../assets/map/seasonal_plaza.json"),
      "utf-8",
    ),
  );

  return map.layers.find(
    (layer: { name: string }) => layer.name === "Collision",
  ).objects;
})();

const overlapsCollision = ({ x, y, width, height }: CollisionObject): boolean =>
  plazaCollisions.some(
    (object) =>
      x < object.x + object.width &&
      x + width > object.x &&
      y < object.y + object.height &&
      y + height > object.y,
  );

describe("PLAZA_STATUE_SPAWN_TILES", () => {
  it("stays within three tiles of the statue", () => {
    PLAZA_STATUE_SPAWN_TILES.forEach((tile) => {
      expect(Math.abs(tile.x - 26)).toBeLessThanOrEqual(3);
      expect(Math.abs(tile.y - 19)).toBeLessThanOrEqual(3);
    });
  });

  it("spreads players out on more than a handful of tiles", () => {
    expect(PLAZA_STATUE_SPAWN_TILES.length).toBeGreaterThan(30);
  });

  it("never lands a player inside a collider", () => {
    const blocked = PLAZA_STATUE_SPAWN_TILES.filter((tile) =>
      overlapsCollision({
        x: tile.x * TILE_SIZE,
        y: tile.y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }),
    );

    expect(blocked).toEqual([]);
  });
});

describe("SPAWNS plaza default", () => {
  it("spawns players below level 5 in the bottom section", () => {
    const spawn = SPAWNS(LEVEL_EXPERIENCE[5] - 1).plaza.default;

    expect(spawn.y).toBeGreaterThanOrEqual(430);
  });

  it("spawns players without a bumpkin in the bottom section", () => {
    const spawn = SPAWNS().plaza.default;

    expect(spawn.y).toBeGreaterThanOrEqual(430);
  });

  it("spawns level 5 and above around the statue", () => {
    const spawn = SPAWNS(LEVEL_EXPERIENCE[5]).plaza.default;

    expect(
      PLAZA_STATUE_SPAWN_TILES.some(
        (tile) =>
          tile.x * TILE_SIZE + TILE_SIZE / 2 === spawn.x &&
          tile.y * TILE_SIZE + TILE_SIZE / 2 === spawn.y,
      ),
    ).toBe(true);
  });
});
