import { v4 as uuidv4 } from "uuid";
import { GameEventName, PlacementEvent } from "features/game/events";
import {
  BUILDINGS_DIMENSIONS,
  BuildingName,
} from "features/game/types/buildings";
import {
  COLLECTIBLES_DIMENSIONS,
  CollectibleName,
} from "features/game/types/craftables";
import { assign, createMachine, Interpreter, sendParent } from "xstate";
import { Coordinates } from "../components/MapPlacement";
import Decimal from "decimal.js-light";
import { Inventory, InventoryItemName } from "features/game/types/game";
import {
  Context as GameMachineContext,
  saveGame,
} from "features/game/lib/gameMachine";
import { RESOURCES } from "features/game/types/resources";

export const RESOURCE_PLACE_EVENTS: Partial<
  Record<InventoryItemName, GameEventName<PlacementEvent>>
> = {
  Tree: "tree.placed",
  Stone: "stone.placed",
  Iron: "iron.placed",
  Gold: "gold.placed",
  "Crop Plot": "plot.placed",
  "Fruit Patch": "fruitPatch.placed",
};

export function placeEvent(
  name: InventoryItemName
): GameEventName<PlacementEvent> {
  if (name in RESOURCES) {
    return RESOURCE_PLACE_EVENTS[name] as GameEventName<PlacementEvent>;
  }

  if (name in BUILDINGS_DIMENSIONS) {
    return "building.placed";
  }

  return "collectible.placed";
}

export interface Context {
  action?: GameEventName<PlacementEvent>;
  coordinates: Coordinates;
  collisionDetected: boolean;
  placeable?: BuildingName | CollectibleName;

  multiple?: boolean;

  origin?: Coordinates;
  requirements: {
    sfl: Decimal;
    ingredients: Inventory;
  };
}

type SelectEvent = {
  type: "SELECT";
  placeable: BuildingName | CollectibleName;
  action: GameEventName<PlacementEvent>;
  requirements: {
    sfl: Decimal;
    ingredients: Inventory;
  };
  collisionDetected: boolean;
  multiple?: boolean;
};

type UpdateEvent = {
  type: "UPDATE";
  coordinates: Coordinates;
  collisionDetected: boolean;
};

type PlaceEvent = {
  type: "PLACE";
  nextOrigin?: Coordinates;
  nextWillCollide?: boolean;
};

type ConstructEvent = {
  type: "CONSTRUCT";
  actionName: PlacementEvent;
};

export type SaveEvent = {
  type: "SAVE";
  gameMachineContext: GameMachineContext;
  rawToken: string;
  farmId: number;
};

export type BlockchainEvent =
  | { type: "DRAG" }
  | { type: "DROP" }
  | SelectEvent
  | ConstructEvent
  | PlaceEvent
  | UpdateEvent
  | SaveEvent
  | { type: "CANCEL" };

export type BlockchainState = {
  value:
    | "saving"
    | "editing"
    | "close"
    | { saving: "idle" }
    | { saving: "autosaving" }
    | { saving: "close" }
    | { editing: "idle" }
    | { editing: "placing" }
    | { editing: "dragging" }
    | { editing: "close" }
    | { editing: "resetting" };
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export const landscapingMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>({
  id: "placeableMachine",
  type: "parallel",
  preserveActionOrder: true,
  on: {
    CANCEL: {
      target: ["saving.done", "editing.done"],
    },
  },
  states: {
    saving: {
      id: "saving",
      initial: "idle",
      states: {
        idle: {
          on: {
            SAVE: {
              target: "autosaving",
            },
          },
        },
        autosaving: {
          invoke: {
            src: async (_: Context, event: any) => {
              const saveEvent = event as SaveEvent;

              const result = await saveGame(
                saveEvent.gameMachineContext,
                undefined,
                saveEvent.farmId,
                saveEvent.rawToken
              );

              return result;
            },
            onDone: {
              target: "idle",
              actions: sendParent((_, event) => ({
                type: "SAVE_SUCCESS",
                data: event.data,
              })),
            },
            onError: {
              actions: (_, event) => {
                console.error(event);
              },
            },
          },
        },
        done: {
          type: "final",
        },
      },
    },
    editing: {
      initial: "idle",
      states: {
        idle: {
          always: [
            {
              target: "placing",
              cond: (context) => !!context.placeable,
            },
          ],
          on: {
            SELECT: {
              target: "placing",
              actions: assign({
                placeable: (_, event) => {
                  console.log({ event });
                  return event.placeable;
                },
                action: (_, event) => event.action,
                requirements: (_, event) => event.requirements,
                multiple: (_, event) => event.multiple,
              }),
            },
          },
        },
        placing: {
          on: {
            UPDATE: {
              actions: assign({
                coordinates: (_, event) => event.coordinates,
                collisionDetected: (_, event) => event.collisionDetected,
              }),
            },
            DRAG: {
              target: "dragging",
            },
            PLACE: [
              {
                target: "placing",
                // They have more to place
                cond: (context, e) => {
                  console.log("Placing", e);
                  return !!context.multiple && !!e.nextOrigin;
                },
                actions: [
                  sendParent(
                    ({ placeable, action, coordinates: { x, y } }) =>
                      ({
                        type: action,
                        name: placeable,
                        coordinates: { x, y },
                        id: uuidv4().slice(0, 8),
                      } as PlacementEvent)
                  ),
                  assign({
                    collisionDetected: (_, event) => !!event.nextWillCollide,
                    origin: (_, event) => event.nextOrigin ?? { x: 0, y: 0 },
                    coordinates: (_, event) =>
                      event.nextOrigin ?? { x: 0, y: 0 },
                  }),
                ],
              },
              {
                target: ["#saving.done", "idle"],
                actions: [
                  sendParent(
                    ({ placeable, action, coordinates: { x, y } }) =>
                      ({
                        type: action,
                        name: placeable,
                        coordinates: { x, y },
                        id: uuidv4().slice(0, 8),
                      } as PlacementEvent)
                  ),
                  assign({
                    placeable: (_) => undefined,
                  }),
                ],
              },
            ],
          },
        },
        resetting: {
          always: {
            target: "placing",
            // Move the next piece
            actions: assign({
              coordinates: (context) => {
                return {
                  x: context.coordinates.x,
                  y: context.coordinates.y - 1,
                };
              },
            }),
          },
        },
        dragging: {
          on: {
            UPDATE: {
              actions: assign({
                coordinates: (_, event) => event.coordinates,
                collisionDetected: (_, event) => event.collisionDetected,
              }),
            },
            DROP: {
              target: "placing",
            },
          },
        },
        done: {
          type: "final",
        },
      },
    },
  },
});
