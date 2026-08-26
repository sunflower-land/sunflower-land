import type Phaser from "phaser";
import type { MachineState } from "features/game/lib/gameMachine";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { queueImage, runLoader } from "../core/assets";
import { gridToWorld, WORLD_TILE } from "../core/coordinates";
import { DEPTHS } from "../core/depths";
import { EntityRenderer } from "../entities/EntityRenderer";
import { getDirtTiles, type DirtSlice } from "./dirtTiles";

/**
 * Dirt/path autotiling under crop plots and Dirt Path collectibles. The
 * derivation is pure (see dirtTiles.ts); this layer only projects the result
 * into sprites — one 1x1-tile image per dirt cell.
 */
export class DirtLayer extends EntityRenderer<DirtSlice> {
  private sprites: Phaser.GameObjects.Image[] = [];

  selector(state: MachineState): DirtSlice {
    return {
      crops: state.context.state.crops,
      collectibles: state.context.state.collectibles,
      biome: getCurrentBiome(state.context.state.island),
    };
  }

  equals = (a: DirtSlice, b: DirtSlice) =>
    a.crops === b.crops &&
    a.collectibles === b.collectibles &&
    a.biome === b.biome;

  async sync(slice: DirtSlice) {
    const token = this.beginSync();

    const tiles = getDirtTiles(slice);

    tiles.forEach(({ texture }) => queueImage(this.scene, texture));
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    this.sprites.forEach((sprite) => sprite.destroy());
    this.sprites = tiles.map(({ x, y, texture }) => {
      const world = gridToWorld({ x, y });
      return this.scene.add
        .image(world.x, world.y, texture)
        .setOrigin(0, 0)
        .setDepth(DEPTHS.DIRT)
        .setDisplaySize(WORLD_TILE, WORLD_TILE);
    });
  }

  protected onDestroy() {
    this.sprites.forEach((sprite) => sprite.destroy());
    this.sprites = [];
  }
}
