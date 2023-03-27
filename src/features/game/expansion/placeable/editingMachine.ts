import { GameEventName, PlacementEvent } from "features/game/events";
import { BuildingName } from "features/game/types/buildings";
import { v4 as uuidv4 } from "uuid";
import { CollectibleName } from "features/game/types/craftables";
import { assign, createMachine, Interpreter, sendParent } from "xstate";
import { Coordinates } from "../components/MapPlacement";
import { SelectPlaceableEvent } from "features/game/lib/gameMachine";

export interface Context {
  placeable?: BuildingName | CollectibleName;
  id?: string;
  action?: GameEventName<PlacementEvent>;
  type?: "BUILDING";
  coordinates?: Coordinates;
  collisionDetected?: boolean;
}

type UpdateEvent = {
  type: "UPDATE";
  coordinates: Coordinates;
  collisionDetected: boolean;
};

type PlaceEvent = {
  type: "PLACE";
  placeable: BuildingName | CollectibleName;
  action: GameEventName<PlacementEvent>;
};

type MoveEvent = {
  type: "MOVE";
};

type SelectToMoveEvent = {
  type: "SELECT_TO_MOVE";
  placeable: BuildingName | CollectibleName;
  id: string;
};

type SelectToPlaceEvent = {
  type: "SELECT_TO_PLACE";
  placeable: BuildingName | CollectibleName;
  action: GameEventName<PlacementEvent>;
};

type SelectedEvent = {
  type: "SELECTED";
  placeable: BuildingName | CollectibleName;
  coordinates: Coordinates;
  id: string;
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
  | SelectToMoveEvent
  | SelectedEvent
  | MoveEvent
  | SelectToPlaceEvent
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
  preserveActionOrder: true,
  on: {
    CANCEL: {
      target: "close",
    },
  },
  states: {
    idle: {
      on: {
        SELECT_TO_MOVE: {
          actions: sendParent(
            (_, event) =>
              ({
                type: "SELECT_PLACEABLE",
                placeable: event.placeable,
                placeableType: "BUILDING",
                id: event.id,
              } as SelectPlaceableEvent)
          ),
        },
        SELECT_TO_PLACE: {
          actions: assign({
            placeable: (_, event) => event.placeable,
            action: (_, event) => event.action,
          }),
        },
        SELECTED: {
          actions: assign({
            placeable: (_, event) => event.placeable,
            coordinates: (_, event) => event.coordinates,
            id: (_, event) => event.id,
          }),
        },
        UPDATE: {
          actions: assign({
            coordinates: (_, event) => event.coordinates,
            collisionDetected: (_, event) => event.collisionDetected,
          }),
        },
        DRAG: {
          target: "dragging",
        },
        PLACE: {
          target: "idle",
          actions: [
            sendParent(
              ({ placeable, action, coordinates }) =>
                ({
                  type: action,
                  name: placeable,
                  coordinates,
                  id: uuidv4(),
                } as PlacementEvent)
            ),
            assign({
              placeable: (_) => undefined,
              id: (_) => undefined,
              coordinates: (_) => undefined,
              collisionDetected: (_) => false,
              type: (_) => undefined,
            }),
          ],
        },
        MOVE: {
          target: "idle",
          actions: [
            sendParent(({ placeable, id, coordinates }) => ({
              type: "building.moved",
              building: placeable,
              coordinates,
              id,
            })),
            assign({
              placeable: (_) => undefined,
              id: (_) => undefined,
              coordinates: (_) => undefined,
              collisionDetected: (_) => false,
              type: (_) => undefined,
            }),
          ],
        },
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
    placed: {
      after: {
        // 300ms allows time for the .bulge animation
        300: {
          target: "close",
        },
      },
    },
    close: {
      type: "final",
    },
  },
});
