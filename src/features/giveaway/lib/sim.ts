/**
 * Deterministic race simulation.
 *
 * The race is a fixed 30-second run: whoever covers the most distance wins. Each
 * racer moves forward at a base speed with cosmetic speed-ups / slow-downs, and
 * their **score is the distance travelled at 30s**. Everything is a pure
 * function of `(farmId, giveawayId)` so every client agrees on the outcome and a
 * player can safely self-report their own final distance.
 */

/** Fixed race length. Score = distance travelled by this point. */
export const RACE_DURATION_MS = 30_000;

// Base forward speed range, in pixels/second (deterministic per racer).
// Tuned so the fastest 30s run stays within the run.json map width (55 tiles).
const MIN_SPEED = 13;
const MAX_SPEED = 26;
// Cosmetic wobble (px). Kept well below base speed so racers never move backward.
const MIN_WOBBLE = 2;
const MAX_WOBBLE = 6;
const MIN_FREQ = 0.3; // rad/s
const MAX_FREQ = 0.8;

/** Upper bound on distance any racer can cover — used to size the track. */
export const RACE_MAX_DISTANCE =
  MAX_SPEED * (RACE_DURATION_MS / 1000) + MAX_WOBBLE * 2;

/** FNV-1a style hash of a string → unsigned 32-bit int. */
function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seedFor(farmId: number, giveawayId: string): number {
  return hashString(`${giveawayId}:${farmId}`);
}

/** Mulberry32 PRNG — returns a function yielding deterministic floats in [0,1). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (min: number, max: number, r: number) => min + (max - min) * r;

export type RacerProfile = {
  farmId: number;
  /** Base forward speed, px/second. */
  speed: number;
  wobbleAmplitude: number;
  wobbleFrequency: number;
  wobblePhase: number;
  /** Final distance at 30s = the score submitted to the server. */
  score: number;
};

export function getRacerProfile(
  farmId: number,
  giveawayId: string,
): RacerProfile {
  const rand = mulberry32(seedFor(farmId, giveawayId));

  const profile = {
    farmId,
    speed: lerp(MIN_SPEED, MAX_SPEED, rand()),
    wobbleAmplitude: lerp(MIN_WOBBLE, MAX_WOBBLE, rand()),
    wobbleFrequency: lerp(MIN_FREQ, MAX_FREQ, rand()),
    wobblePhase: rand() * Math.PI * 2,
    score: 0,
  };

  profile.score = Math.round(distanceAt(profile, RACE_DURATION_MS));
  return profile;
}

/**
 * Distance (px) covered by `elapsedMs`, capped at the 30s finish. Anchored to 0
 * at t=0. The wobble term makes the pace visibly ebb and flow without ever
 * reversing (amplitude·frequency < base speed).
 */
export function distanceAt(
  profile: Omit<RacerProfile, "score"> | RacerProfile,
  elapsedMs: number,
): number {
  const t = Math.min(Math.max(elapsedMs, 0), RACE_DURATION_MS) / 1000;
  const base = profile.speed * t;
  const wobble =
    profile.wobbleAmplitude *
    (Math.sin(profile.wobbleFrequency * t + profile.wobblePhase) -
      Math.sin(profile.wobblePhase));
  return Math.max(0, base + wobble);
}

export function isRaceOver(elapsedMs: number): boolean {
  return elapsedMs >= RACE_DURATION_MS;
}
