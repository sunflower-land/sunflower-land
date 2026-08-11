import { generateQuestion, type TriviaQuestion } from "./triviaQuestions";

export type { TriviaQuestion } from "./triviaQuestions";

/**
 * Trivia mini-game timing.
 *
 * A round of trivia is ten questions, each a 10s answer window then a 3s
 * reveal, preceded by a rules intro. Questions are generated deterministically
 * from (giveawayId, roundIndex) — see triviaQuestions.ts — so every player sees
 * the identical question (image and all) at the same time.
 */

// Kahoot-style scoring: a correct answer is worth between MIN and MAX points,
// scaled by how quickly you locked it in — answer instantly for the full MAX,
// dwindling to MIN if you only just make it before the reveal.
export const TRIVIA_MAX_POINTS = 1000;
export const TRIVIA_MIN_POINTS = 500;

/** A rules + countdown intro before the first question, once the lobby ends. */
export const TRIVIA_INTRO_MS = 6000;
/** How long players have to answer, then how long the reveal lasts. */
export const TRIVIA_ANSWER_MS = 10000;
export const TRIVIA_FEEDBACK_MS = 3000;
export const TRIVIA_ROUND_MS = TRIVIA_ANSWER_MS + TRIVIA_FEEDBACK_MS;

/** Points for a correct answer locked in `answeredAtMs` into the answer window. */
export function speedPoints(answeredAtMs: number): number {
  const within = Math.min(Math.max(answeredAtMs, 0), TRIVIA_ANSWER_MS);
  const fraction = 1 - within / TRIVIA_ANSWER_MS; // 1 = instant, 0 = last moment
  return Math.round(
    TRIVIA_MIN_POINTS + (TRIVIA_MAX_POINTS - TRIVIA_MIN_POINTS) * fraction,
  );
}

export type TriviaPhase = "intro" | "answer" | "feedback";

/** A round of trivia is ten questions. */
export const TRIVIA_ROUNDS = 10;

/** Total trivia game length — its own duration, not the shared 30s race. */
export const TRIVIA_GAME_MS = TRIVIA_INTRO_MS + TRIVIA_ROUNDS * TRIVIA_ROUND_MS;

/** True once the trivia game (all six questions + reveals) has finished. */
export function isTriviaOver(elapsedMs: number): boolean {
  return elapsedMs >= TRIVIA_GAME_MS;
}

/** The round (question) index + phase for a given elapsed time. */
export function triviaRound(elapsedMs: number): {
  index: number;
  phase: TriviaPhase;
  msLeft: number;
} {
  const clamped = Math.max(0, elapsedMs);
  // The intro plays before question 0.
  if (clamped < TRIVIA_INTRO_MS) {
    return { index: 0, phase: "intro", msLeft: TRIVIA_INTRO_MS - clamped };
  }

  const t = clamped - TRIVIA_INTRO_MS;
  const index = Math.floor(t / TRIVIA_ROUND_MS);
  const within = t % TRIVIA_ROUND_MS;
  return within < TRIVIA_ANSWER_MS
    ? { index, phase: "answer", msLeft: TRIVIA_ANSWER_MS - within }
    : { index, phase: "feedback", msLeft: TRIVIA_ROUND_MS - within };
}

/** Deterministic question for a round — identical on every client. */
export function questionForRound(
  giveawayId: string,
  index: number,
): TriviaQuestion {
  return generateQuestion(giveawayId, index, TRIVIA_ROUNDS);
}
