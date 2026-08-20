export interface CaptchaGameProps {
  /** The player passed the minigame. */
  onSuccess: () => void;
  /** The player failed an attempt - the orchestrator deals a fresh game. */
  onFailure: () => void;
}
