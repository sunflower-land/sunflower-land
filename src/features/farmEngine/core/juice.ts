import type Phaser from "phaser";

/**
 * Small, layered feedback for in-world actions — the "juice". Each effect is
 * tiny on its own; an action reads as responsive when two or three land
 * together within ~100ms of the tap (a flash, a few chips, the sound).
 *
 * House rules these follow (see the art notes in ARCHITECTURE.md):
 * - Whole source pixels only. No scale tweens: scaling NEAREST art at our
 *   fractional zoom shimmers, and a scale-up hover was tried and rejected.
 * - No soft glows or alpha gradients. Particles are flat 1px squares in
 *   palette colours that vanish, rather than fade.
 * - No camera shake: this is a calm game and players act in long bursts.
 * - Everything is cosmetic and self-cleaning, and callers gate on the
 *   player's "show animations" preference.
 */

type Movable = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

/** EDG32 tones, as [light, mid, dark] per material. */
export const CHIPS = {
  wood: [0xe4a672, 0xb86f50, 0x733e39],
  leaf: [0x63c74d, 0x3e8948, 0x265c42],
  soil: [0xe4a672, 0xb86f50, 0x743f39],
  stone: [0xffffff, 0xc0cbdc, 0x8b9bb4],
  iron: [0xead4aa, 0xc0cbdc, 0x5a6988],
  gold: [0xfee761, 0xfeae34, 0xf77622],
  crimstone: [0xf6757a, 0xe43b44, 0xa22633],
  sunstone: [0xfee761, 0xf77622, 0xbe4a2f],
  crystal: [0xffffff, 0x2ce8f5, 0x0099db],
} as const;

export type ChipMaterial = keyof typeof CHIPS;

/** Bursts alive at once; beyond this new ones are skipped, not queued. */
const MAX_LIVE_BURSTS = 24;
const liveBursts = new WeakMap<Phaser.Scene, number>();

/**
 * A handful of 1px chips thrown up and out from a point, falling under
 * gravity and vanishing. `count` 5–6 for a tap, ~10 for a node breaking.
 */
export function burst(
  scene: Phaser.Scene,
  options: {
    x: number;
    y: number;
    material: ChipMaterial;
    depth: number;
    count?: number;
    /** Horizontal throw in source px. */
    spread?: number;
    /** Peak upward throw in source px. */
    lift?: number;
    durationMs?: number;
  },
) {
  const live = liveBursts.get(scene) ?? 0;
  if (live >= MAX_LIVE_BURSTS) return;
  liveBursts.set(scene, live + 1);

  const {
    x,
    y,
    material,
    depth,
    count = 6,
    spread = 9,
    lift = 9,
    durationMs = 380,
  } = options;
  const colors = CHIPS[material];

  const chips = Array.from({ length: count }, (_, index) => {
    const rect = scene.add
      .rectangle(x, y, 1, 1, colors[index % colors.length])
      .setDepth(depth);
    return {
      rect,
      // Spread evenly, then jitter, so a burst never clumps to one side.
      vx: ((index + 0.5) / count - 0.5) * 2 * spread + (Math.random() - 0.5),
      up: lift * (0.55 + Math.random() * 0.45),
      // Each chip winks out at its own moment late in the arc.
      life: 0.7 + Math.random() * 0.3,
    };
  });

  scene.tweens.addCounter({
    from: 0,
    to: 1,
    duration: durationMs,
    onUpdate: (tween) => {
      const t = tween.getValue() ?? 0;
      for (const chip of chips) {
        if (!chip.rect.active) continue;
        // Up-and-over arc: rises to `up` at the midpoint, lands a little
        // below where it started.
        const arc = 4 * chip.up * t * (1 - t) - 3 * t * t;
        chip.rect.setPosition(x + chip.vx * t, y - arc);
        if (t >= chip.life) chip.rect.setVisible(false);
      }
    },
    onComplete: () => {
      chips.forEach((chip) => chip.rect.destroy());
      liveBursts.set(scene, Math.max(0, (liveBursts.get(scene) ?? 1) - 1));
    },
  });
}

/**
 * Flash art solid white for a few frames — the classic "that connected"
 * cue. Skipped when the art already carries a tint that means something
 * (landscaping selection, a dimmed invalid target).
 */
export function hitFlash(scene: Phaser.Scene, target: Movable, ms = 55) {
  if (!target.active || target.isTinted) return;
  target.setTintFill(0xffffff);
  scene.time.delayedCall(ms, () => {
    if (target.active) target.clearTint();
  });
}

/**
 * Move art through a sequence of whole-pixel y offsets (ending on 0), one
 * per step. If anything else repositions the art mid-sequence — a renderer
 * re-syncing it — the sequence abandons itself rather than fight for it, so
 * the art can never be left displaced.
 */
function stepOffsets(
  scene: Phaser.Scene,
  target: Movable,
  offsets: number[],
  stepMs: number,
) {
  const base = target.y;
  let applied = 0;
  offsets.forEach((offset, index) => {
    const apply = () => {
      if (!target.active || target.y !== base + applied) return;
      target.y = base + offset;
      applied = offset;
    };
    if (index === 0) apply();
    else scene.time.delayedCall(index * stepMs, apply);
  });
}

/** A quick hop: up 2px, 1px, back. For art that was just acted on. */
export function hop(scene: Phaser.Scene, target: Movable) {
  stepOffsets(scene, target, [-2, -1, 0], 45);
}

/** Drop into place from just above: for art that has just appeared. */
export function settle(scene: Phaser.Scene, target: Movable) {
  stepOffsets(scene, target, [-3, -1, 1, 0], 40);
}

type Positioned = Phaser.GameObjects.GameObject &
  Phaser.GameObjects.Components.Transform;

/**
 * The DOM's `.ready` attention shake [styles.css ready-shake]: once a period,
 * three 1px side-to-side jolts over the first 14% of it, then still. The CSS
 * moves by PIXEL_SCALE CSS px, which is one source pixel, so this is the same
 * motion in whole pixels. Stops itself when the target is destroyed.
 */
export function readyShake(
  scene: Phaser.Scene,
  target: Positioned,
  periodMs = 4000,
) {
  const stepMs = periodMs * 0.02;
  const offsets = [1, -1, 1, -1, 1, -1, 0];
  const baseX = target.x;
  const shake = () =>
    offsets.forEach((offset, index) =>
      scene.time.delayedCall((index + 1) * stepMs, () => {
        if (target.active) target.x = baseX + offset;
      }),
    );
  shake();
  const loop = scene.time.addEvent({
    delay: periodMs,
    loop: true,
    callback: shake,
  });
  target.once("destroy", () => loop.remove());
}

/**
 * The DOM's `animate-float` [styles.css floating]: a slow bob down and back.
 * CSS eases through 6 CSS px (~2 source px); here the offset steps through
 * whole pixels on the same curve. If something else moves the target, the
 * bob carries on from its new position. Stops when the target is destroyed.
 */
export function floatBob(
  scene: Phaser.Scene,
  target: Positioned,
  {
    periodMs = 3000,
    amplitude = 2,
  }: { periodMs?: number; amplitude?: number } = {},
) {
  let base = target.y;
  let applied = 0;
  const start = scene.time.now;
  const loop = scene.time.addEvent({
    delay: 50,
    loop: true,
    callback: () => {
      if (!target.active) return;
      if (target.y !== base + applied) {
        base = target.y;
        applied = 0;
      }
      const t = ((scene.time.now - start) % periodMs) / periodMs;
      const offset = Math.round(
        (amplitude * (1 - Math.cos(2 * Math.PI * t))) / 2,
      );
      if (offset === applied) return;
      target.y = base + offset;
      applied = offset;
    },
  });
  target.once("destroy", () => loop.remove());
}

/**
 * Press feedback: art sinks 1px while the pointer is held on it and springs
 * back on release. Clicks fire on release (so a pan that starts on an entity
 * stays a pan), which leaves the press itself with nothing to show for it —
 * this is the acknowledgement that the touch landed.
 *
 * Returns the release function. Same self-abandoning rule as stepOffsets.
 */
export function press(target: Movable): () => void {
  if (!target.active) return () => undefined;
  const base = target.y;
  target.y = base + 1;
  return () => {
    if (target.active && target.y === base + 1) target.y = base;
  };
}
