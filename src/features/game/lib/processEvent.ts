import { EVENTS, GameEvent } from "../events";
import { GameState } from "../types/game";

export function processEvent(state: GameState, action: GameEvent): GameState {
  const handler = EVENTS[action.type];

  if (!handler) {
    throw new Error(`Unknown event type: ${action}`);
  }

  return handler({
    state,
    // TODO - fix type error
    action: action as never,
  });
}
