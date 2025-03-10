import { GameState } from "features/game/types/game";

export function isFaceVerified({ game }: { game: GameState }) {
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
