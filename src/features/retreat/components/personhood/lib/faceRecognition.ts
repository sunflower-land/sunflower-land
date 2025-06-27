import { GameState } from "features/game/types/game";

export function isFaceVerified({ game }: { game: GameState }) {
  if (game.verified) return true;

  const { faceRecognition } = game;

  if (!faceRecognition) {
    return false;
  }

  if (faceRecognition.history.length === 0) {
    return false;
  }

  const lastAttempt =
    faceRecognition.history[faceRecognition.history.length - 1];

  return lastAttempt.event === "succeeded";
}

const RECOGNITION_ATTEMPTS = 5;
export function getFaceRecognitionAttemptsLeft({ game }: { game: GameState }) {
  const { faceRecognition } = game;

  const history = faceRecognition?.history ?? [];

  const failedAttempts = history.filter(
    (attempt) => attempt.event === "failed" || attempt.event === "duplicate",
  ).length;

  return RECOGNITION_ATTEMPTS - failedAttempts;
}

/**
 * After 5 attempts, require a 24 hr cooldown period between attempts
 */
export function faceCooldownUntil({ game }: { game: GameState }) {
  const { faceRecognition } = game;

  if (!faceRecognition) {
    return 0;
  }

  if (faceRecognition.history.length < 5) {
    return 0;
  }

  const lastAttempt =
    faceRecognition.history[faceRecognition.history.length - 1];

  if (lastAttempt.event === "succeeded") {
    return 0;
  }

  return new Date(lastAttempt.createdAt).getTime() + 24 * 60 * 60 * 1000;
}
