import { createMachine, Interpreter } from "xstate";
import { Coordinates } from "../components/MapPlacement";

export interface Context {
  placeable: string;
}

type DropEvent = { type: "PLACE"; coordinates: Coordinates };

export type BlockchainEvent =
  | { type: "DRAG" }
  | { type: "DROP" }
  | DropEvent
  | { type: "CANCEL" };

export type BlockchainState = {
  value: "idle" | "dragging" | "placing" | "close";
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
        DRAG: {
          target: "dragging",
        },
        PLACE: {
          target: "placing",
        },
      },
    },
    dragging: {
      on: {
        DROP: {
          target: "idle",
        },
      },
    },
    placing: {
      invoke: {
        src: async (context, event) => {
          alert(
            JSON.stringify(
              {
                item: context.placeable,
                coordinates: (event as DropEvent).coordinates,
              },
              null,
              2
            )
          );
        },
        onDone: {
          target: "close",
        },
      },
    },
    close: {
      type: "final",
    },
  },
});
