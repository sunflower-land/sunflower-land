/**
 * Jumper scoring. Everyone rises straight up; a marker spins around a ring and
 * you tap when it reaches the top. The closer to dead-centre, the higher the
 * jump — a miss still nudges you up a little, so you keep climbing (just slower)
 * while better-timed players pull ahead. Pure + tiny so it's easy to test.
 */
export type JumpQuality = "perfect" | "good" | "miss";

/** The top of the ring (radians) — where you want the marker when you tap. */
export const RING_TOP = -Math.PI / 2;

/** Angular half-width (radians) of the perfect zone at the top of the ring. */
export const PERFECT_ARC = 0.2;
/** Angular half-width (radians) of the good zone (wider, around the perfect). */
export const GOOD_ARC = 0.5;

/** How far each jump lifts you, in world px. */
export const JUMP_HEIGHT: Record<JumpQuality, number> = {
  perfect: 75,
  good: 40,
  miss: 8,
};

/** Grade a tap by how far the marker was from the top of the ring (radians). */
export function jumpQuality(angularDistance: number): JumpQuality {
  const d = Math.abs(angularDistance);
  if (d <= PERFECT_ARC) return "perfect";
  if (d <= GOOD_ARC) return "good";
  return "miss";
}
