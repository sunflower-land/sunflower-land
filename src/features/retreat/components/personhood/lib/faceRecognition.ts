import type { FaceRecognitionEvent, GameState } from "features/game/types/game";

export function isFaceVerified({ game }: { game: GameState }) {
  if (game.verified) return true;

  const { faceRecognition } = game;

  if (!faceRecognition) {
    return false;
  }

  if (faceRecognition.history.length === 0) {
    return false;
  }

  // Non-mutating max-by-createdAt. Using `>=` so that when timestamps
  // tie, the entry appended later in the array wins — important for
  // append-only history where an `ownerChanged` event with the same
  // millisecond as a prior `succeeded` must still stale verification.
  const lastAttempt = faceRecognition.history.reduce((latest, attempt) =>
    attempt.createdAt >= latest.createdAt ? attempt : latest,
  );

  return lastAttempt.event === "succeeded";
}

const RECOGNITION_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 24 * 60 * 60 * 1000;

const isFailedAttempt = (attempt: FaceRecognitionEvent) =>
  attempt.event === "failed" || attempt.event === "duplicate";

/**
 * Failed attempts (no face detected or a duplicate face) within the last
 * 24 hours and since the last successful scan, most recent first.
 * Successful scans and ownership changes are kept in the history but are
 * not attempts.
 */
function getRecentFailedAttempts({
  game,
  now,
}: {
  game: GameState;
  now: number;
}) {
  const history = game.faceRecognition?.history ?? [];

  const lastSucceededAt = history
    .filter((attempt) => attempt.event === "succeeded")
    .reduce((latest, attempt) => Math.max(latest, attempt.createdAt), 0);

  return history
    .filter(
      (attempt) =>
        isFailedAttempt(attempt) &&
        attempt.createdAt > lastSucceededAt &&
        now - attempt.createdAt < ATTEMPT_WINDOW_MS,
    )
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getFaceRecognitionAttemptsLeft({
  game,
  now = Date.now(),
}: {
  game: GameState;
  now?: number;
}) {
  const failedAttempts = getRecentFailedAttempts({ game, now }).length;

  return Math.max(0, RECOGNITION_ATTEMPTS - failedAttempts);
}

/**
 * After 5 failed attempts within 24 hours, require a cooldown period until
 * the oldest of those attempts is more than 24 hours old
 */
export function faceCooldownUntil({
  game,
  now = Date.now(),
}: {
  game: GameState;
  now?: number;
}) {
  const failedAttempts = getRecentFailedAttempts({ game, now });

  if (failedAttempts.length < RECOGNITION_ATTEMPTS) {
    return 0;
  }

  return failedAttempts[RECOGNITION_ATTEMPTS - 1].createdAt + ATTEMPT_WINDOW_MS;
}
