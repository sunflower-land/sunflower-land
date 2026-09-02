import type Phaser from "phaser";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { DPR } from "../core/rendering";

/**
 * The engine's text primitive: the DOM's `font-pixel` face ("Secondary") at
 * its inherited 16px em, counter-scaled by PIXEL_SCALE so world text reads
 * the same size as DOM text, rasterised at physical resolution.
 */
export function pixelText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  options: {
    color?: string;
    shadow?: boolean;
    /** Em size in CSS px (DOM inherited default: 16). */
    fontSize?: number;
    /** DOM face to match (default: the `font-pixel` "Secondary"). */
    fontFamily?: string;
  } = {},
): Phaser.GameObjects.Text {
  const {
    color = "#ffffff",
    shadow = true,
    fontSize = 16,
    fontFamily = "Secondary",
  } = options;
  const label = scene.add
    .text(x, y, text, {
      fontFamily,
      fontSize: `${fontSize}px`,
      color,
      resolution: DPR * PIXEL_SCALE,
    })
    .setScale(1 / PIXEL_SCALE);
  if (shadow) label.setShadow(1, 1, "#000000", 0);

  // Re-render once the webfont is in, so it doesn't stick with the fallback.
  if (typeof document !== "undefined" && document.fonts?.ready) {
    void document.fonts.ready.then(() => {
      if (label.active) label.updateText();
    });
  }
  return label;
}
