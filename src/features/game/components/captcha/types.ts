/** Minigame identifiers sent with `captcha.succeeded` / `captcha.failed`. */
export type CaptchaGameName = "jigsaw" | "rotate";

export interface CaptchaGameProps {
  /** The player passed the minigame. */
  onSuccess: () => void;
  /** The player failed an attempt - the orchestrator deals a fresh game. */
  onFailure: () => void;
}
