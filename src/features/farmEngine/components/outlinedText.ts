import type Phaser from "phaser";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { DPR } from "../core/rendering";

/**
 * Chunky display type for in-world marks — ported from project-ii's battle
 * numbers (`outlinedText.ts` + `DamageNumber.ts` there): Grandstander at the
 * 900 weight, a black outline, and a hard extruded black drop under it, for
 * text that sits on bright art with no panel behind it.
 *
 * Phaser strokes before it fills, so the outline sits behind the glyph and
 * only its outer half shows. The shadow is a black silhouette (stroke and
 * fill both shadowed), offset straight down and unblurred — an extrude, not
 * a haze.
 */

const DISPLAY_FONT = '"Grandstander", sans-serif';
const DISPLAY_BLACK = "900";

/** Outline weight in em, so it scales with the type. */
const OUTLINE_EM = 0.15;

/** The gain-chip yellow project-ii tones plain hits with. */
export const GAIN_YELLOW = "#ffc63a";

let fontLoad: Promise<unknown> | undefined;

/**
 * Canvas text can't lazily pull a webfont the way DOM text does — the file
 * must be in memory before glyphs are baked. Kick the load once and keep the
 * PROMISE: texts re-render when it settles (fonts.ready is useless here — it
 * can already be resolved before this face ever starts loading).
 */
function ensureFontLoading(): Promise<unknown> | undefined {
  if (typeof document === "undefined") return undefined;
  try {
    fontLoad ??= document.fonts.load(`${DISPLAY_BLACK} 16px Grandstander`);
  } catch {
    // canvas falls back to sans-serif until the face arrives
  }
  return fontLoad;
}

export function outlinedDisplayStyle({
  fontPx,
  fill = "#ffffff",
  shadowOffsetY = 2,
}: {
  /** CSS px at user zoom 1 — the text is counter-scaled like DOM labels. */
  fontPx: number;
  fill?: string;
  shadowOffsetY?: number;
}): Phaser.Types.GameObjects.Text.TextStyle {
  return {
    fontFamily: DISPLAY_FONT,
    fontSize: `${fontPx}px`,
    fontStyle: DISPLAY_BLACK,
    color: fill,
    stroke: "#000000",
    strokeThickness: fontPx * OUTLINE_EM,
    resolution: DPR * PIXEL_SCALE,
    shadow: {
      offsetX: 0,
      offsetY: shadowOffsetY,
      color: "#000000",
      blur: 0,
      stroke: true,
      fill: true,
    },
  };
}

/**
 * An outlined display-type Text in world space. `fontPx` is CSS px — the
 * object is counter-scaled by PIXEL_SCALE so it reads the same size the DOM
 * would draw it, rasterised at physical resolution for crispness.
 */
export function outlinedText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  content: string,
  options: { fontPx: number; fill?: string; shadowOffsetY?: number },
): Phaser.GameObjects.Text {
  const load = ensureFontLoading();
  const text = scene.add
    .text(x, y, content, outlinedDisplayStyle(options))
    .setScale(1 / PIXEL_SCALE);
  // The webfont may still be loading on first use; re-render once the LOAD
  // settles so the mark doesn't stick with the fallback face.
  void load?.then(() => {
    if (text.active) text.updateText();
  });
  return text;
}
