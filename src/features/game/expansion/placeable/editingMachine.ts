import { GameEventName, PlacementEvent } from "features/game/events";
import { BuildingName } from "features/game/types/buildings";
import { CollectibleName } from "features/game/types/craftables";
import { assign, createMachine, Interpreter, sendParent } from "xstate";
import { Coordinates } from "../components/MapPlacement";
import { SelectToMoveEvent } from "features/game/lib/gameMachine";
import { GameState } from "features/game/types/game";

export interface Context {
  gameState: GameState;
  placeable?: BuildingName | CollectibleName;
  id?: string;
  action?: GameEventName<PlacementEvent>;
  type: "BUILDING";
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
};

type SelectEvent = {
  type: "SELECT";
  placeable: BuildingName | CollectibleName;
  id: string;
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
  | SelectEvent
  | SelectedEvent
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
        SELECT: {
          actions: [
            assign({
              placeable: (_, event) => event.placeable,
              id: (_, event) => event.id,
              coordinates: (context, event) => {
                const { placeable, id } = event as SelectEvent;
                const building = context.gameState.buildings[
                  placeable as BuildingName
                ]?.find((building) => building.id === id);

                if (!building) return;

                return building.coordinates;
              },
            }),
            sendParent(
              (_, event) =>
                ({
                  type: "SELECT_TO_MOVE",
                  placeable: event.placeable,
                  placeableType: "BUILDING",
                  id: event.id,
                } as SelectToMoveEvent)
            ),
          ],
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
          target: "placed",
          // actions: sendParent(
          //   ({ placeable, action, coordinates: { x, y } }) =>
          //     ({
          //       type: action,
          //       name: placeable,
          //       coordinates: { x, y },
          //       id: uuidv4(),
          //     } as PlacementEvent)
          // ),
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
