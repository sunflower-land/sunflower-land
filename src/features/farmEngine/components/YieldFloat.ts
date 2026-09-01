import type Phaser from "phaser";
import { formatNumber } from "lib/utils/formatNumber";
import { queueImage, runLoader } from "../core/assets";
import { nativeScale } from "../core/pixelArt";
import { GAIN_YELLOW, outlinedText } from "./outlinedText";

/**
 * Transient in-scene "+N" feedback (the DOM Depleting-component and Plot
 * yield floats), dressed like project-ii's battle numbers: chunky
 * Grandstander-900 with a black outline and hard extruded shadow, popping
 * past full size, settling, then drifting up and fading. Optional leading
 * icon; self-destroys.
 */
export function playYieldFloat(
  scene: Phaser.Scene,
  options: {
    x: number;
    y: number;
    amount: number;
    color?: string;
    icon?: string;
    /** Icon width in source px. */
    iconWidth?: number;
    depth: number;
    durationMs?: number;
  },
) {
  const {
    x,
    y,
    amount,
    color = GAIN_YELLOW,
    icon,
    iconWidth = 10,
    depth,
    durationMs = 2000,
  } = options;

  // Renderers queue their yield icons up front, but if one slipped through
  // (or a boost drops an unexpected item), load it now rather than rendering
  // Phaser's missing-texture square.
  if (icon && !scene.textures.exists(icon)) {
    queueImage(scene, icon);
    void runLoader(scene).then(() => {
      if (scene.sys.isActive()) playYieldFloat(scene, options);
    });
    return;
  }

  const children: Phaser.GameObjects.GameObject[] = [];
  let cursor = 0;

  if (icon) {
    const image = scene.add.image(cursor, 0, icon).setOrigin(0, 0.5);
    nativeScale(image, iconWidth);
    children.push(image);
    cursor += iconWidth + 2;
  }

  const label = outlinedText(scene, cursor, 0, `+${formatNumber(amount)}`, {
    fontPx: 14,
    fill: color,
    shadowOffsetY: 2,
  });
  label.setOrigin(0, 0.55);
  children.push(label);

  const container = scene.add.container(x, y, children).setDepth(depth);
  container.setAlpha(0);
  container.setScale(0.6);

  // [project-ii DamageNumber] pop past full, settle, drift up, fade the tail.
  const POP_MS = 120;
  const SETTLE_MS = 100;
  const RISE_PX = 10;
  const fadeMs = Math.round(durationMs * 0.35);
  const driftMs = Math.max(1, durationMs - POP_MS - SETTLE_MS);

  scene.tweens.add({
    targets: container,
    scale: 1.3,
    alpha: 1,
    duration: POP_MS,
    ease: "Quad.easeOut",
    onComplete: () => {
      if (!container.active) return;
      scene.tweens.add({
        targets: container,
        scale: 1,
        duration: SETTLE_MS,
        ease: "Quad.easeOut",
      });
      scene.tweens.add({
        targets: container,
        y: y - RISE_PX,
        duration: driftMs,
        ease: "Sine.easeOut",
      });
      scene.tweens.add({
        targets: container,
        alpha: 0,
        delay: Math.max(0, driftMs - fadeMs),
        duration: fadeMs,
        onComplete: () => container.destroy(),
      });
    },
  });
}
