import type Phaser from "phaser";
import { formatNumber } from "lib/utils/formatNumber";
import { pixelText } from "./pixelText";

/**
 * Transient in-scene "+N" feedback (the DOM Depleting-component and Plot
 * yield floats). Optional leading icon; fades in, rises slightly, fades out,
 * self-destroys.
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
    color = "#ffffff",
    icon,
    iconWidth = 10,
    depth,
    durationMs = 2000,
  } = options;

  const children: Phaser.GameObjects.GameObject[] = [];
  let cursor = 0;

  if (icon) {
    const image = scene.add.image(cursor, 0, icon).setOrigin(0, 0.5);
    image.setScale(iconWidth / image.width);
    children.push(image);
    cursor += iconWidth + 2;
  }

  const label = pixelText(scene, cursor, 0, `+${formatNumber(amount)}`, {
    color,
  });
  label.setOrigin(0, 0.5);
  children.push(label);

  const container = scene.add.container(x, y, children).setDepth(depth);
  container.setAlpha(0);

  scene.tweens.add({
    targets: container,
    alpha: 1,
    y: y - 4,
    duration: 200,
    ease: "Sine.easeOut",
    onComplete: () => {
      scene.time.delayedCall(durationMs - 400, () => {
        if (!container.active) return;
        scene.tweens.add({
          targets: container,
          alpha: 0,
          duration: 200,
          onComplete: () => container.destroy(),
        });
      });
    },
  });
}
