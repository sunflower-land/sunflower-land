import type { GameState } from "features/game/types/game";
import { produce } from "immer";

/**
 * How long an acceptance of the Terms & Conditions stays valid for. Once the
 * player's last acceptance is older than this they are asked to accept again.
 */
export const TCS_ACKNOWLEDGEMENT_DURATION = 30 * 24 * 60 * 60 * 1000;

/**
 * Whether the player needs to (re-)accept the Terms & Conditions.
 *
 * True when they have never accepted them, or when their last acceptance has
 * aged past {@link TCS_ACKNOWLEDGEMENT_DURATION}.
 */
export function hasAcknowledgedTcs({
  game,
  now = Date.now(),
}: {
  game: GameState;
  now?: number;
}): boolean {
  const acknowledgedAt = game.tcsAcknowledged;

  if (!acknowledgedAt) return false;

  return acknowledgedAt > now - TCS_ACKNOWLEDGEMENT_DURATION;
}

export type AcknowledgeTcsAction = {
  type: "tcs.acknowledged";
};

type Options = {
  state: Readonly<GameState>;
  action: AcknowledgeTcsAction;
  createdAt?: number;
};

export function acknowledgeTcs({
  state,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    stateCopy.tcsAcknowledged = createdAt;

    return stateCopy;
  });
}
