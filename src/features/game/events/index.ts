import { GameState } from "../GameProvider";

import { craft, CraftAction } from "./craft";
import { sell, SellAction } from "./sell";
import { plant, PlantAction } from "./plant";
import { harvest, HarvestAction } from "./harvest";

export type GameEvent = CraftAction | SellAction | PlantAction | HarvestAction;

type EventName = Extract<GameEvent, { type: string }>["type"];

type Handlers = {
  // Each event name should have a key
  [Name in EventName]: (
    state: GameState,
    // Extract the correct event payload from the list of events
    event: Extract<GameEvent, { type: Name }>
  ) => GameState;
};

const EVENTS: Handlers = {
  "item.planted": plant,
  "item.harvested": harvest,
  "item.crafted": craft,
  "crop.sell": sell,
};

export function processEvent(state: GameState, action: GameEvent): GameState {
  const handler = EVENTS[action.type];

  if (!handler) {
    throw new Error(`Unknown event type: ${action}`);
  }

  // TODO - fix any
  return handler(state, action as any);
}
