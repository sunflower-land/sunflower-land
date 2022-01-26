import { craft, CraftAction } from "./craft";
import { sell, SellAction } from "./sell";
import { plant, PlantAction } from "./plant";
import { harvest, HarvestAction } from "./harvest";

import { GameState } from "../types/game";

export type GameEvent = CraftAction | SellAction | PlantAction | HarvestAction;

type EventName = Extract<GameEvent, { type: string }>["type"];

/**
 * Type which enables us to map the event name to the payload containing that event name
 */
type Handlers = {
  [Name in EventName]: (
    state: GameState,
    // Extract the correct event payload from the list of events
    event: Extract<GameEvent, { type: Name }>
  ) => GameState;
};

export const EVENTS: Handlers = {
  "item.planted": plant,
  "item.harvested": harvest,
  "item.crafted": craft,
  "item.sell": sell,
};

export function processEvent(state: GameState, action: GameEvent): GameState {
  const handler = EVENTS[action.type];

  if (!handler) {
    throw new Error(`Unknown event type: ${action}`);
  }

  // TODO - fix any
  return handler(state, action as any);
}
