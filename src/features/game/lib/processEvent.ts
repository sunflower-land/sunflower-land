import { EVENTS, type GameEvent } from "../events";
import type { GameState } from "../types/game";
import type { Announcements } from "../types/announcements";

type ProcessEventArgs = {
  state: GameState;
  action: GameEvent;
  createdAt: number;
  announcements?: Announcements;
  farmId: number;
  visitorState?: GameState;
};

export function processEvent({
  state,
  action,
  announcements,
  farmId,
  visitorState,
  createdAt,
}: ProcessEventArgs): GameState | [GameState, GameState] {
  const handler = EVENTS[action.type];

  if (!handler) {
    throw new Error(`Unknown event type: ${action}`);
  }

  const newState = handler({
    state,
    // TODO - fix type error
    action: action as never,
    announcements,
    farmId,
    visitorState,
    createdAt,
  });

  return newState;
}
