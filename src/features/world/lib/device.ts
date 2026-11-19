import { isMobile } from "mobile-device-detect";

/**
 * Whether the browser reports any touch support. Some laptops report a touch
 * digitizer even when they have no touchscreen, so this alone is not enough
 * to decide that the player is on a touch-first device.
 */
function hasTouchSupport() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * Whether the primary pointer is a finger rather than a mouse or trackpad.
 */
function hasCoarsePointer() {
  if (typeof window.matchMedia !== "function") return false;

  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * True when the player should get touch controls: the browser supports touch
 * and either the primary pointer is coarse or the user agent is a phone or
 * tablet. iPads report a desktop user agent, so the pointer check keeps them
 * covered, while laptops with a mouse or trackpad get desktop controls.
 */
export function isTouchDevice() {
  return hasTouchSupport() && (hasCoarsePointer() || isMobile);
}
