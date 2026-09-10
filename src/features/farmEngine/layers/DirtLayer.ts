import Phaser from "phaser";
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
 * into pixels.
 *
 * Stamped into ONE RenderTexture rather than one image per cell, for the same
 * reason the ocean is [OceanLayer]. The camera zoom is fractional (DPR x 2.625
 * x user zoom), so a 16px tile edge rarely lands on a whole screen pixel; with
 * `roundPixels` each sprite then rounds its own position independently and
 * neighbours stop meeting exactly, leaving hairline gaps that show the green
 * land base underneath. One texture has one rounded position and an exact
 * internal texel grid, so the seams can't happen.
 */
export class DirtLayer extends EntityRenderer<DirtSlice> {
  private surface: Phaser.GameObjects.RenderTexture | undefined;

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

    this.surface?.destroy();
    this.surface = undefined;
    if (tiles.length === 0) return;

    // Only as big as the dirt actually is, rather than the whole board.
    const placed = tiles.map((tile) => ({
      ...tile,
      world: gridToWorld({ x: tile.x, y: tile.y }),
    }));
    const left = Math.min(...placed.map((tile) => tile.world.x));
    const top = Math.min(...placed.map((tile) => tile.world.y));
    const right = Math.max(...placed.map((tile) => tile.world.x)) + WORLD_TILE;
    const bottom = Math.max(...placed.map((tile) => tile.world.y)) + WORLD_TILE;

    this.surface = this.scene.add
      .renderTexture(left, top, right - left, bottom - top)
      .setOrigin(0, 0)
      .setDepth(DEPTHS.DIRT);
    this.surface.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    // One reusable stamp per texture — the autotiler reuses a small set of
    // edge tiles across the whole farm.
    const stamps = new Map<string, Phaser.GameObjects.Image>();
    const stampFor = (texture: string) => {
      let stamp = stamps.get(texture);
      if (!stamp) {
        const source = this.scene.textures.get(texture).getSourceImage();
        stamp = this.scene.make
          .image({ key: texture, add: false })
          .setOrigin(0, 0)
          .setScale(WORLD_TILE / source.width);
        stamps.set(texture, stamp);
      }
      return stamp;
    };

    this.surface.beginDraw();
    for (const tile of placed) {
      this.surface.batchDraw(
        stampFor(tile.texture),
        tile.world.x - left,
        tile.world.y - top,
      );
    }
    this.surface.endDraw();
    stamps.forEach((stamp) => stamp.destroy());
  }

  protected onDestroy() {
    this.surface?.destroy();
    this.surface = undefined;
  }
}
