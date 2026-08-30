import type Phaser from "phaser";

/**
 * Pixel-art sizing rule: world art renders at its texture's NATIVE size, one
 * art pixel to one world pixel, never resampled.
 *
 * The DOM farm hardcodes a display width per item (`width: PIXEL_SCALE * 64`
 * and friends). Several of those numbers no longer match the art they point
 * at — the barn asset is 72px drawn at 64, the greenhouse 62px drawn at 78 —
 * so following them resamples the sprite and the pixels stop matching the
 * rest of the farm. The asset is the source of truth; the hardcoded width is
 * only used to keep the art's CENTRE where the DOM put it.
 */

type Positionable = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

/**
 * Draw `image` at native scale and return the x-shift needed to keep its
 * centre where a `intendedWidth`-wide draw would have put it. Callers add the
 * shift to the x they would otherwise use.
 */
export function nativeScale(image: Positionable, intendedWidth?: number) {
  image.setScale(1);
  if (intendedWidth === undefined) return 0;
  // frame width, so spritesheets measure one cell rather than the strip
  const native = image.frame?.width ?? image.width;
  return (intendedWidth - native) / 2;
}
