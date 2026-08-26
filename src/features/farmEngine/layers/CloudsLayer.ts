import type Phaser from "phaser";
import { SUNNYSIDE } from "assets/sunnyside";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import type { MachineState } from "features/game/lib/gameMachine";
import { queueImage, runLoader } from "../core/assets";
import type { Unsubscribe } from "../bridge/subscriptions";
import {
  getGameboardDimensions,
  getGameboardWorldBounds,
} from "../core/coordinates";
import { DEPTHS } from "../core/depths";
import { EntityRenderer } from "../entities/EntityRenderer";

/**
 * The cloud vignette. DOM parity:
 * - StaticClouds.tsx: four frame strips (top/left/right/bottom) STRETCHED to
 *   bands of the board, painted above everything (z-30).
 * - DynamicClouds.tsx: 32 individual clouds positioned against the same
 *   1536x1088 design board (z-20), gently bobbing (`animate-float`: translateY
 *   0 -> 6 CSS px -> 0 over 3s, ease-in-out) when animations are enabled.
 */

const DESIGN_WIDTH = 1536;
const DESIGN_HEIGHT = 1088;

// Bob amplitude: 6 CSS px in world units.
const FLOAT_WORLD_PX = 6 / PIXEL_SCALE;
const FLOAT_HALF_PERIOD_MS = 1500;

const CLOUD_TEXTURES: Record<number, { texture: string; width: number }> = {
  1: { texture: SUNNYSIDE.land.cloud1, width: 68 },
  2: { texture: SUNNYSIDE.land.cloud2, width: 36 },
  3: { texture: SUNNYSIDE.land.cloud3, width: 68 },
  4: { texture: SUNNYSIDE.land.cloud4, width: 68 },
  5: { texture: SUNNYSIDE.land.cloud5, width: 52 },
  6: { texture: SUNNYSIDE.land.cloud6, width: 68 },
};

// [cloudNumber, designLeft, designTop] — DynamicClouds.tsx's CLOUDS table.
const CLOUDS: [number, number, number][] = [
  [1, 214, 6],
  [1, 54, 310],
  [1, 262, 726],
  [1, 358, 838],
  [1, 294, 934],
  [1, 918, 38],
  [1, 1350, 86],
  [1, 1366, 326],
  [1, 838, 902],
  [1, 966, 790],
  [1, 854, 262],
  [2, 374, 262],
  [2, 550, 86],
  [2, 294, 582],
  [2, 486, 662],
  [2, 566, 934],
  [2, 738, 786],
  [2, 1062, 886],
  [2, 1054, 574],
  [2, 1158, 534],
  [2, 1158, 310],
  [2, 982, 278],
  [3, 694, 246],
  [3, 454, 342],
  [4, 418, 502],
  [4, 470, 758],
  [4, 838, 806],
  [4, 1050, 688],
  [4, 1048, 318],
  [5, 566, 246],
  [6, 646, 830],
  [6, 1046, 470],
];

// [texture, band] where band = (xScale, yScale, cssBoardW) -> css rect
type StaticBand = {
  texture: string;
  rect: (
    xScale: number,
    yScale: number,
    cssWidth: number,
  ) => { left: number; top: number; width: number; height: number };
};

const STATIC_BANDS: StaticBand[] = [
  {
    texture: SUNNYSIDE.land.mainCloudsTop,
    rect: (x, y) => ({
      left: 0,
      top: 0,
      width: Math.round(1536 * x),
      height: Math.round(304 * y),
    }),
  },
  {
    texture: SUNNYSIDE.land.mainCloudsLeft,
    rect: (x, y) => ({
      left: 0,
      top: Math.round(304 * y),
      width: Math.round(496 * x),
      height: Math.round(528 * y),
    }),
  },
  {
    texture: SUNNYSIDE.land.mainCloudsRight,
    // DOM anchors this one with `right: 0`.
    rect: (x, y, cssWidth) => ({
      left: cssWidth - Math.round(512 * x),
      top: Math.round(304 * y),
      width: Math.round(512 * x),
      height: Math.round(528 * y),
    }),
  },
  {
    texture: SUNNYSIDE.land.mainCloudsBottom,
    rect: (x, y) => ({
      left: 0,
      top: Math.round(528 * y) + Math.round(304 * y),
      width: Math.round(1536 * x),
      height: Math.round(256 * y),
    }),
  },
];

type Slice = { expansionCount: number };

export class CloudsLayer extends EntityRenderer<Slice> {
  private staticSprites: Phaser.GameObjects.Image[] = [];
  private dynamicSprites: Phaser.GameObjects.Image[] = [];
  private tweens: Phaser.Tweens.Tween[] = [];
  private unsubscribeUi: Unsubscribe | undefined;

  selector(state: MachineState): Slice {
    return {
      expansionCount:
        state.context.state.inventory["Basic Land"]?.toNumber() ?? 3,
    };
  }

  equals = (a: Slice, b: Slice) => a.expansionCount === b.expansionCount;

  mount() {
    super.mount();
    this.unsubscribeUi = this.bridge.ui.subscribe(() => this.applyFloat());
  }

  async sync({ expansionCount }: Slice) {
    const token = this.beginSync();
    STATIC_BANDS.forEach(({ texture }) => queueImage(this.scene, texture));
    Object.values(CLOUD_TEXTURES).forEach(({ texture }) =>
      queueImage(this.scene, texture),
    );
    await runLoader(this.scene);
    if (this.isStale(token)) return;

    const dims = getGameboardDimensions(expansionCount);
    const bounds = getGameboardWorldBounds(expansionCount);
    const cssWidth = dims.x * GRID_WIDTH_PX;
    const xScale = cssWidth / DESIGN_WIDTH;
    const yScale = (dims.y * GRID_WIDTH_PX) / DESIGN_HEIGHT;

    this.clearSprites();

    this.staticSprites = STATIC_BANDS.map(({ texture, rect }) => {
      const css = rect(xScale, yScale, cssWidth);
      return this.scene.add
        .image(
          bounds.x + css.left / PIXEL_SCALE,
          bounds.y + css.top / PIXEL_SCALE,
          texture,
        )
        .setOrigin(0, 0)
        .setDepth(DEPTHS.STATIC_CLOUDS)
        .setDisplaySize(css.width / PIXEL_SCALE, css.height / PIXEL_SCALE);
    });

    this.dynamicSprites = CLOUDS.map(([cloudNumber, left, top]) => {
      const { texture, width } = CLOUD_TEXTURES[cloudNumber];
      const sprite = this.scene.add
        .image(
          bounds.x + Math.round(left * xScale) / PIXEL_SCALE,
          bounds.y + Math.round(top * yScale) / PIXEL_SCALE,
          texture,
        )
        .setOrigin(0, 0)
        .setDepth(DEPTHS.DYNAMIC_CLOUDS);
      sprite.setScale((width * xScale) / PIXEL_SCALE / sprite.width);
      return sprite;
    });

    this.applyFloat();
  }

  private applyFloat() {
    this.tweens.forEach((tween) => tween.remove());
    this.tweens = [];

    if (!this.bridge.ui.get().showAnimations) return;

    this.tweens = this.dynamicSprites.map((sprite) =>
      this.scene.tweens.add({
        targets: sprite,
        y: sprite.y + FLOAT_WORLD_PX,
        duration: FLOAT_HALF_PERIOD_MS,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      }),
    );
  }

  private clearSprites() {
    this.tweens.forEach((tween) => tween.remove());
    this.tweens = [];
    this.staticSprites.forEach((sprite) => sprite.destroy());
    this.staticSprites = [];
    this.dynamicSprites.forEach((sprite) => sprite.destroy());
    this.dynamicSprites = [];
  }

  protected onDestroy() {
    this.unsubscribeUi?.();
    this.unsubscribeUi = undefined;
    this.clearSprites();
  }
}
