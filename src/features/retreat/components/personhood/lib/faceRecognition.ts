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
const FACE_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const isFailedAttempt = (attempt: FaceRecognitionEvent) =>
  attempt.event === "failed" || attempt.event === "duplicate";

export function getFaceRecognitionAttemptsLeft({ game }: { game: GameState }) {
  const { faceRecognition } = game;

  const history = faceRecognition?.history ?? [];

  const failedAttempts = history.filter(isFailedAttempt).length;

  return RECOGNITION_ATTEMPTS - failedAttempts;
}

/**
 * After 5 failed attempts, require a 24 hr cooldown period between attempts.
 * Only failed/duplicate scans count: previous successes and ownership
 * changes in the history must not use up the player's attempts.
 */
export function faceCooldownUntil({ game }: { game: GameState }) {
  const { faceRecognition } = game;

  if (!faceRecognition) {
    return 0;
  }

  const failedAttempts = faceRecognition.history.filter(isFailedAttempt);

  if (failedAttempts.length < RECOGNITION_ATTEMPTS) {
    return 0;
  }

  const lastAttempt =
    faceRecognition.history[faceRecognition.history.length - 1];

  if (lastAttempt.event === "succeeded") {
    return 0;
  }

  const lastFailedAt = Math.max(
    ...failedAttempts.map((attempt) => attempt.createdAt),
  );

  return lastFailedAt + FACE_COOLDOWN_MS;
}
