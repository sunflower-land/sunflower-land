import type Phaser from "phaser";
import { getGameboardWorldBounds, WORLD_TILE } from "../core/coordinates";
import type { FarmScene } from "../scenes/FarmScene";

/**
 * Dev-only tile grid over the gameboard, enabled with localStorage
 * "phaserFarm.debug".
 */
export class DebugGrid {
  private graphics: Phaser.GameObjects.Graphics;

  constructor(private readonly scene: FarmScene) {
    this.graphics = scene.add.graphics();
    this.draw();
  }

  private draw() {
    const bounds = getGameboardWorldBounds(
      3, // grid size doesn't need to track expansions for debugging
    );
    const g = this.graphics;

    g.lineStyle(1, 0xffffff, 0.15);
    for (let x = bounds.x; x <= bounds.x + bounds.width; x += WORLD_TILE) {
      g.lineBetween(x, bounds.y, x, bounds.y + bounds.height);
    }
    for (let y = bounds.y; y <= bounds.y + bounds.height; y += WORLD_TILE) {
      g.lineBetween(bounds.x, y, bounds.x + bounds.width, y);
    }
  }

  destroy() {
    this.graphics.destroy();
  }
}
