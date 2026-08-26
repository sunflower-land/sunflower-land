import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import type { MachineState } from "features/game/lib/gameMachine";
import { queueImage, runLoader } from "../core/assets";
import {
  getGameboardDimensions,
  getGameboardWorldBounds,
} from "../core/coordinates";
import { DEPTHS } from "../core/depths";
import { EntityRenderer } from "../entities/EntityRenderer";

/**
 * Decorative islands in the ocean. DOM parity (BackgroundIslands.tsx): the art
 * was placed against a 1536x1088 design board and scales with the actual
 * gameboard, so positions/sizes stretch as the land expands. The DOM rounds
 * positions in CSS px before painting — replicated here before converting to
 * world units.
 */

const DESIGN_WIDTH = 1536;
const DESIGN_HEIGHT = 1088;

// [texture, designLeft, designTop, designWidth]
const ISLANDS: [string, number, number, number][] = [
  [SUNNYSIDE.land.lavaIsland, 82, 79, 192],
  [SUNNYSIDE.land.greenIsland, 192, 799, 128],
  [SUNNYSIDE.land.cactusIsland, 1321, 753, 142],
  [SUNNYSIDE.land.crabAtoll, 1241, 153, 62],
  [SUNNYSIDE.land.starfishAtoll, 1433, 329, 62],
  [SUNNYSIDE.land.tombStoneIsland, 1053, 976, 54],
  [SUNNYSIDE.land.potionIsland, 957, 97, 54],
  [SUNNYSIDE.land.crossIsland, 125, 592, 54],
];

type Slice = { expansionCount: number };

export class BackgroundIslandsLayer extends EntityRenderer<Slice> {
  private sprites: Phaser.GameObjects.Image[] = [];

  selector(state: MachineState): Slice {
    return {
      expansionCount:
        state.context.state.inventory["Basic Land"]?.toNumber() ?? 3,
    };
  }

  equals = (a: Slice, b: Slice) => a.expansionCount === b.expansionCount;

  async sync({ expansionCount }: Slice) {
    const token = this.beginSync();
    ISLANDS.forEach(([texture]) => queueImage(this.scene, texture));
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const dims = getGameboardDimensions(expansionCount);
    const bounds = getGameboardWorldBounds(expansionCount);
    const xScale = (dims.x * GRID_WIDTH_PX) / DESIGN_WIDTH;
    const yScale = (dims.y * GRID_WIDTH_PX) / DESIGN_HEIGHT;

    this.sprites.forEach((sprite) => sprite.destroy());
    this.sprites = ISLANDS.map(([texture, left, top, width]) => {
      const worldX = bounds.x + Math.round(left * xScale) / PIXEL_SCALE;
      const worldY = bounds.y + Math.round(top * yScale) / PIXEL_SCALE;
      const displayWidth = (width * xScale) / PIXEL_SCALE;

      const sprite = this.scene.add
        .image(worldX, worldY, texture)
        .setOrigin(0, 0)
        .setDepth(DEPTHS.BACKGROUND_ISLANDS);
      // DOM sets width only; height follows the aspect ratio.
      sprite.setScale(displayWidth / sprite.width);
      return sprite;
    });
  }

  protected onDestroy() {
    this.sprites.forEach((sprite) => sprite.destroy());
    this.sprites = [];
  }
}
