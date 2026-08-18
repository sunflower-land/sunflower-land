import { hashString, mulberry32 } from "./sim";

/**
 * Pumpkin Pop — timing, popping and scoring rules.
 *
 * Five 15-second rounds. During a round you tap WATER as often as you like and
 * your pumpkin swells with every splash. When the round closes the whole field
 * is ranked by that round's watering and **the top 30% pop** — they bank
 * NOTHING for the round, while everyone else banks their waters.
 *
 * Nobody is ever knocked out: pop in round one and you're straight back in for
 * round two with a fresh pumpkin. Your banked rounds accumulate, and the
 * biggest total after all five rounds wins. So the tension is the inverse of
 * every other mini-game: you want a good score every round, just never the
 * best one.
 *
 * Everything here is a pure function of `(giveawayId, round, …)` so every client
 * simulates the same field and agrees on who popped.
 */

// --- Timing -----------------------------------------------------------------

export const POP_ROUNDS = 5;
/** A rules + countdown intro before round 1, once the lobby ends. */
export const POP_INTRO_MS = 6000;
/** How long the watering window lasts… */
export const POP_WATER_MS = 15_000;
/** …then how long the pop / elimination reveal is held on screen. */
export const POP_REVEAL_MS = 6000;
export const POP_ROUND_MS = POP_WATER_MS + POP_REVEAL_MS;

/** Total game length — its own clock, not the shared 30s race one. */
export const POP_GAME_MS = POP_INTRO_MS + POP_ROUNDS * POP_ROUND_MS;

export type PopPhase = "intro" | "water" | "reveal";

export function isPopOver(elapsedMs: number): boolean {
  return elapsedMs >= POP_GAME_MS;
}

/** The round index + phase for a given elapsed time. */
export function popRound(elapsedMs: number): {
  index: number;
  phase: PopPhase;
  msLeft: number;
} {
  const clamped = Math.max(0, elapsedMs);
  if (clamped < POP_INTRO_MS) {
    return { index: 0, phase: "intro", msLeft: POP_INTRO_MS - clamped };
  }

  const t = clamped - POP_INTRO_MS;
  const index = Math.min(POP_ROUNDS - 1, Math.floor(t / POP_ROUND_MS));
  const within = t - index * POP_ROUND_MS;
  return within < POP_WATER_MS
    ? { index, phase: "water", msLeft: POP_WATER_MS - within }
    : { index, phase: "reveal", msLeft: POP_ROUND_MS - within };
}

// --- Elimination ------------------------------------------------------------

/** Fraction of the field popped at the end of every round. */
export const POP_ELIMINATION_FRACTION = 0.3;

/**
 * How many of `field` players pop this round. Always at least one (so every
 * round has stakes) and never everyone (so every round banks somebody points).
 */
export function popCount(field: number): number {
  if (field <= 1) return 0;
  return Math.min(
    field - 1,
    Math.max(1, Math.round(field * POP_ELIMINATION_FRACTION)),
  );
}

/** One grower's score FOR A SINGLE ROUND — see `roundScores`. */
export type PopEntry = { id: string; score: number };

export type PopVerdict = {
  /** Ids whose pumpkins pop, biggest waterer first. */
  popped: string[];
  /**
   * The cap: the lowest round score that still popped. Water this much and
   * you're out. `Infinity` when nobody pops.
   */
  cap: number;
  /** The highest score that survived — the most anyone got away with. */
  safeLine: number;
};

/**
 * Rank a round and work out who pops.
 *
 * Ties are broken by a hash of `(round, id)` rather than by id order, so a
 * field where nobody watered doesn't pop the same unlucky players every single
 * round. Deterministic either way, so all clients agree — and note that at the
 * cap itself the tie-break decides, so `cap` is "the lowest score that popped",
 * not a hard threshold everyone above is guaranteed to be caught by.
 */
export function popVerdict(entries: PopEntry[], round: number): PopVerdict {
  const ranked = [...entries].sort(
    (a, b) =>
      b.score - a.score ||
      hashString(`${round}:${b.id}`) - hashString(`${round}:${a.id}`),
  );

  const count = popCount(ranked.length);
  const popped = ranked.slice(0, count);
  const survivors = ranked.slice(count);

  return {
    popped: popped.map((e) => e.id),
    cap: popped.length ? popped[popped.length - 1].score : Infinity,
    safeLine: survivors.reduce((max, e) => Math.max(max, e.score), 0),
  };
}

/**
 * Each grower's score for the round just gone: the points they've banked NOW
 * minus the snapshot taken when the round opened.
 *
 * Every grower — you, the simulated neighbours, and real players in the room —
 * publishes one running total, so a round is always "the total now, less the
 * total when this round started". One rule, applied to everyone identically,
 * including whoever is holding the controls.
 */
export function roundScores(
  growers: { id: string; points: number; pointsAtRoundStart: number }[],
): PopEntry[] {
  return growers.map((g) => ({
    id: g.id,
    score: Math.max(0, g.points - g.pointsAtRoundStart),
  }));
}

// --- The simulated field ----------------------------------------------------
// Community games have no server-side round model yet, so the neighbours you're
// competing against are simulated locally (and identically on every client,
// being seeded off the giveaway id). Real players in the room are ranked
// alongside them — see PopScene.

/** How many growers (you included) the patch is filled out to. */
export const POP_FIELD_SIZE = 16;

const BOT_NAMES = [
  "Sprout",
  "Wheatley",
  "Bramble",
  "Tilly",
  "Marrow",
  "Pip",
  "Clover",
  "Rusty",
  "Barley",
  "Nettle",
  "Gourdon",
  "Mossy",
  "Fennel",
  "Hazel",
  "Thistle",
  "Dodger",
  "Beetle",
  "Quill",
];

export type PopBot = {
  id: string;
  name: string;
};

/** The simulated neighbours for this giveaway, in a stable order. */
export function popBots(giveawayId: string, count: number): PopBot[] {
  const rand = mulberry32(hashString(`pop:${giveawayId}`));
  // Shuffle the names so different events field different neighbours.
  const names = [...BOT_NAMES];
  for (let i = names.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }

  return Array.from({ length: Math.max(0, count) }, (_, i) => ({
    id: `bot-${i}`,
    name: names[i % names.length],
  }));
}

/**
 * How fast a bot waters in a given round, in taps per second. Re-rolled every
 * round, so the neighbours who went hard (and popped) last round aren't the
 * same ones this round — the field stays unpredictable.
 *
 * The top of the range is deliberately below what a mashing human manages: if
 * you tap flat out you WILL be in the top 30%.
 */
export function botRate(giveawayId: string, botId: string, round: number) {
  const rand = mulberry32(hashString(`pop:${giveawayId}:${botId}:${round}`));
  return 0.5 + rand() * 2.9;
}

/** A bot's water count this far into the round. */
export function botWaters(rate: number, elapsedInRoundMs: number): number {
  const seconds = Math.min(Math.max(elapsedInRoundMs, 0), POP_WATER_MS) / 1000;
  return Math.floor(rate * seconds);
}
