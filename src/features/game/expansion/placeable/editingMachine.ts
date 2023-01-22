import { v4 as uuidv4 } from "uuid";
import { GameEventName, PlacementEvent } from "features/game/events";
import { BuildingName } from "features/game/types/buildings";
import { CollectibleName } from "features/game/types/craftables";
import { assign, createMachine, Interpreter, sendParent } from "xstate";
import { Coordinates } from "../components/MapPlacement";

export interface Context {
  placeable: BuildingName | CollectibleName;
  action: GameEventName<PlacementEvent>;
  coordinates: Coordinates;
  collisionDetected: boolean;
}

type UpdateEvent = {
  type: "UPDATE";
  coordinates: Coordinates;
  collisionDetected: boolean;
};

type PlaceEvent = {
  type: "PLACE";
};

type ConstructEvent = {
  type: "CONSTRUCT";
  actionName: PlacementEvent;
};

export type BlockchainEvent =
  | { type: "DRAG" }
  | { type: "DROP" }
  | ConstructEvent
  | PlaceEvent
  | UpdateEvent
  | { type: "CANCEL" };

export type BlockchainState = {
  value: "idle" | "dragging" | "placed" | "close";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export const editingMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>({
  id: "placeableMachine",
  initial: "idle",
  on: {
    CANCEL: {
      target: "close",
    },
  },
  states: {
    idle: {
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
            target: "idle",
            // If they have more to place?
            cond: () => true,
            actions: sendParent(
              ({ placeable, action, coordinates: { x, y } }) =>
                ({
                  type: action,
                  name: placeable,
                  coordinates: { x, y },
                  id: uuidv4(),
                } as PlacementEvent)
            ),
          },
          {
            target: "close",
            actions: sendParent(
              ({ placeable, action, coordinates: { x, y } }) =>
                ({
                  type: action,
                  name: placeable,
                  coordinates: { x, y },
                  id: uuidv4(),
                } as PlacementEvent)
            ),
          },
        ],
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
          target: "idle",
        },
      },
    },
    close: {
      type: "final",
    },
  },
});
