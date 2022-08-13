import { GameEventName, PlacementEvent } from "features/game/events";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";
import { CollectibleName } from "features/game/types/craftables";
import { assign, createMachine, Interpreter, sendParent } from "xstate";
import { Coordinates } from "../components/MapPlacement";

export type PlaceableType = "building" | "collectible";

export interface Context {
  placeable: BuildingName | CollectibleName;
  placeableType: PlaceableType;
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

function getTypedPlaceable(placeable: BuildingName | CollectibleName) {
  if (placeable in BUILDINGS) return placeable as BuildingName;

  return placeable as CollectibleName;
}

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
        DRAG: {
          target: "dragging",
        },
        CONSTRUCT: {
          target: "placed",
          actions: sendParent<Context, ConstructEvent, PlacementEvent>(
            ({ placeable, placeableType, coordinates: { x, y } }) => ({
              type: `${placeableType}.placed` as GameEventName<PlacementEvent>,
              name: placeable as BuildingName,
              coordinates: { x, y },
            })
          ),
        },
        PLACE: {
          target: "placed",
          actions: sendParent<Context, PlaceEvent, PlacementEvent>(
            ({ placeable, placeableType, coordinates: { x, y } }) => ({
              type: `${placeableType}.placed` as GameEventName<PlacementEvent>,
              name: placeable,
              coordinates: { x, y },
            })
          ),
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
