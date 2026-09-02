import Phaser from "phaser";

/**
 * Render scale for the canvas backing store, following project-ii's model:
 * the canvas is sized at CSS pixels * DPR and squeezed back down via
 * `zoom: 1 / DPR`, so the world renders at native device resolution and the
 * browser's final composite is a clean integer downscale.
 *
 * This is what makes fractional art magnification look smooth: our parity
 * magnification is PIXEL_SCALE (2.625) CSS px per source px — fractional, so
 * texels would alternate 2px and 3px on a 1x buffer ("pixel inconsistency").
 * Rendered into a DPR-supersampled buffer the variation shrinks to a
 * physical pixel (a fraction of a CSS pixel) and reads as uniform texels.
 *
 * Floored at 2: low-density displays supersample at 2x and downscale 2:1.
 * Integer values keep NEAREST-filtered pixel art crisp through the
 * downscale.
 */
/**
 * Coarse-pointer devices (phones/tablets). Backing-store and MSAA memory
 * scale with DPR², and mobile WebKit kills the tab well before a desktop
 * would — these devices trade a step of supersampling for headroom.
 */
export const IS_COARSE_POINTER =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(pointer: coarse)").matches;

export const DPR = Phaser.Math.Clamp(
  Math.round(window.devicePixelRatio || 1),
  2,
  // A DPR-3 phone still supersamples at 2x; the fractional composite that
  // costs is invisible next to the ~2.25x framebuffer memory it saves.
  IS_COARSE_POINTER ? 2 : 4,
);
