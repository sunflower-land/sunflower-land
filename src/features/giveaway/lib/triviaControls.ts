/**
 * The channel between the Trivia answer buttons (React) and the scene. Tapping
 * an answer sets `pending`; the scene drains it each frame and moves the player
 * into that answer's zone. `picked` is written back by the scene so the HUD can
 * highlight your current choice.
 */
export interface TriviaControls {
  /** React → scene: the answer just tapped (drained by the scene). */
  pending: number | null;
  /** Tap an answer (called from the button HUD). */
  pick: (answer: number) => void;
  /** scene → React: the answer currently selected (for highlighting). */
  picked: number | null;
  /** scene → React: how the last question resolved, for the centre popup.
   * `nonce` bumps each reveal so the popup re-animates. */
  lastResult: {
    correct: boolean;
    seconds: number;
    points: number;
    nonce: number;
  } | null;
}
