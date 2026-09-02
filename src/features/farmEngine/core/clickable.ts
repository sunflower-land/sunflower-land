import type Phaser from "phaser";
import { PAN_DEAD_ZONE_CSS_PX } from "./camera";
import { DPR } from "./rendering";
import { applyHoverGlow, clearHoverGlow, type GlowTarget } from "./hoverGlow";

/**
 * The engine's clickable affordance: hand cursor + click + hover callback +
 * the shader hover glow (core/hoverGlow.ts). Interactive objects are usually
 * invisible Zones, so a renderer passes `glow` to say which art lights up.
 * (History: a scale-up and a flat 1px tinted-copy outline were both tried
 * and rejected — the outline traced baked-in shadows.)
 *
 * Hover popovers are a browse affordance, not click feedback: after a click
 * the hover is cleared and stays suppressed until the pointer leaves and
 * re-enters, so acting on a node (plant, chop...) doesn't instantly pop the
 * timer tooltip over it. Touch taps never raise hover at all — Phaser fires
 * pointerover as part of the tap (pointer already down).
 */

type ClickableObject =
  | Phaser.GameObjects.Image
  | Phaser.GameObjects.Sprite
  | Phaser.GameObjects.Container
  | Phaser.GameObjects.Zone;

type ClickableOptions = {
  onHoverChange?: (hovered: boolean) => void;
  /**
   * Art lit by the hover glow. A getter, because renderers swap the art
   * object as state changes (growth stages, animated art).
   */
  glow?: () => GlowTarget | undefined;
  /**
   * Stay clickable while visiting another farm [MapPlacement
   * enableOnVisitClick] — everything else is click-dead on a visit.
   */
  visitClickable?: boolean;
};

export function makeClickable(
  scene: Phaser.Scene,
  obj: ClickableObject,
  onClick: () => void,
  { onHoverChange, visitClickable, glow }: ClickableOptions = {},
) {
  // Containers must have set their own hit area before this.
  if (!obj.input) {
    obj.setInteractive({ useHandCursor: true });
  }

  let hoverSuppressed = false;
  let glowing: GlowTarget | undefined;
  const showGlow = () => {
    const art = glow?.();
    if (!art || glowing === art) return;
    if (glowing) clearHoverGlow(glowing);
    applyHoverGlow(scene, art);
    glowing = art;
  };
  const hideGlow = () => {
    if (glowing) clearHoverGlow(glowing);
    glowing = undefined;
  };

  // Click on RELEASE, not press: a pan that happens to start on an entity
  // must stay a pan (mobile users drag from wherever their finger lands).
  // The travel guard shares the camera's pan dead zone, so any release that
  // the camera would treat as a drag is never a click.
  obj.on("pointerup", (pointer: Phaser.Input.Pointer) => {
    // Normal world interactions are inert in landscaping mode [Land.tsx
    // swaps to READONLY components]; selection is the controller's job.
    const flags = scene as {
      landscapingActive?: boolean;
      visitingActive?: boolean;
    };
    if (flags.landscapingActive) return;
    if (flags.visitingActive && !visitClickable) return;
    if (pointer.getDistance() > PAN_DEAD_ZONE_CSS_PX * DPR) return;
    hideGlow();
    if (onHoverChange) {
      hoverSuppressed = true;
      onHoverChange(false);
    }
    onClick();
  });

  obj.on("pointerover", (pointer: Phaser.Input.Pointer) => {
    // A held pointer entering is a tap or a pan crossing over, not a hover.
    if (hoverSuppressed || pointer.isDown) return;
    const flags = scene as { landscapingActive?: boolean };
    // Landscaping has its own selection treatment; don't double up.
    if (!flags.landscapingActive) showGlow();
    onHoverChange?.(true);
  });
  obj.on("pointerout", () => {
    hoverSuppressed = false;
    hideGlow();
    onHoverChange?.(false);
  });
  obj.once("destroy", hideGlow);
}
