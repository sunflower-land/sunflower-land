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

/**
 * Scale an icon to EXACTLY `width` source px, keeping its aspect ratio.
 *
 * The rule above is for world art, where the asset is the source of truth and
 * the DOM's hardcoded width only re-centres it. UI icons are the opposite
 * case: a label chip or a "+N" float lays text out after the icon, so the
 * icon has to occupy the width the layout budgeted for it. Using nativeScale
 * there drew every icon at its native size (SUNNYSIDE UI icons are typically
 * 16-32px) while the cursor advanced by the intended 6-10px, so the icon ran
 * over its own text and out of its chip background.
 */
export function fitWidth(image: Positionable, width: number) {
  const native = image.frame?.width ?? image.width;
  if (!native) return;
  image.setScale(width / native);
}

/** Texels per source px in an outlined texture (see outlinedTexture). */
const OUTLINE_SUPERSAMPLE = 8;
/** Phaser.Textures.FilterMode.NEAREST, without a runtime Phaser import. */
const NEAREST_FILTER = 1;

/**
 * The DOM's `img-highlight` / `img-highlight-heavy` [styles.css]: three
 * chained hard-edged white drop-shadows (1px or 2px CSS), which leave a crisp
 * white rim on every side but the two diagonal corners. Reproduced as a baked
 * texture rather than a shader so a farm full of ready items costs nothing
 * per frame: the art is redrawn at OUTLINE_SUPERSAMPLE texels per source px
 * (NEAREST, so the pixels stay square) and its white silhouette is stamped
 * at the same six offsets the chained CSS shadows produce.
 *
 * `thickness` is in source px (CSS px / PIXEL_SCALE). Returns the outlined
 * texture's key plus the scale and padding a caller needs to draw it over
 * the original's footprint, or undefined when the art can't be baked
 * (missing texture, or a multi-frame sheet).
 */
export function outlinedTexture(
  scene: Phaser.Scene,
  key: string,
  thickness: number,
): { key: string; scale: number; pad: number } | undefined {
  const factor = OUTLINE_SUPERSAMPLE;
  const rim = Math.max(1, Math.round(thickness * factor));
  const outKey = `${key}#outline-${rim}`;
  const result = { key: outKey, scale: 1 / factor, pad: rim / factor };
  if (scene.textures.exists(outKey)) return result;
  if (!scene.textures.exists(key)) return undefined;

  const texture = scene.textures.get(key);
  if (texture.frameTotal > 2) return undefined; // __BASE + one frame
  const frame = texture.get();
  const source = texture.getSourceImage() as CanvasImageSource;
  const width = frame.cutWidth * factor;
  const height = frame.cutHeight * factor;

  const makeCanvas = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width + rim * 2;
    canvas.height = height + rim * 2;
    const context = canvas.getContext("2d");
    if (context) context.imageSmoothingEnabled = false;
    return { canvas, context };
  };
  const drawArt = (context: CanvasRenderingContext2D) =>
    context.drawImage(
      source,
      frame.cutX,
      frame.cutY,
      frame.cutWidth,
      frame.cutHeight,
      rim,
      rim,
      width,
      height,
    );

  const silhouette = makeCanvas();
  const out = makeCanvas();
  if (!silhouette.context || !out.context) return undefined;
  drawArt(silhouette.context);
  silhouette.context.globalCompositeOperation = "source-in";
  silhouette.context.fillStyle = "#ffffff";
  silhouette.context.fillRect(
    0,
    0,
    silhouette.canvas.width,
    silhouette.canvas.height,
  );

  // drop-shadow(1 1) -> (-1 0) -> (0 -1), each shadowing the result so far.
  const OFFSETS = [
    [1, 1],
    [1, 0],
    [0, 1],
    [0, -1],
    [-1, 0],
    [-1, -1],
  ];
  OFFSETS.forEach(([dx, dy]) =>
    out.context!.drawImage(silhouette.canvas, dx * rim, dy * rim),
  );
  drawArt(out.context);

  const added = scene.textures.addCanvas(outKey, out.canvas);
  added?.setFilter(NEAREST_FILTER);
  return result;
}
