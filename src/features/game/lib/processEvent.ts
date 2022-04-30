import { EVENTS, GameEvent } from "../events";
import { GameState } from "../types/game";

type ProcessEventArgs = {
  state: GameState;
  action: GameEvent;
  onChain: GameState;
};
export function processEvent({
  state,
  action,
  onChain,
}: ProcessEventArgs): GameState {
  const handler = EVENTS[action.type];

  if (!handler) {
    throw new Error(`Unknown event type: ${action}`);
  }

  const newState = handler({
    state,
    // TODO - fix type error
    action: action as never,
  });

  // Check if valid progress
  const progress = newState.balance.sub(onChain.balance);

  /**
   * Contract enforced SFL caps
   * Just in case a player gets in a corrupt state and manages to earn extra SFL
   */
  if (progress.gt(100)) {
    alert("Session capped at 100 SFL. You must sync first.");
    throw new Error("Session capped at 100 SFL");
  }

  return newState;
}
