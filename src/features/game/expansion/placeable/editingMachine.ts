import { createMachine, Interpreter } from "xstate";

export interface Context {
  placeable: string;
}

export type BlockchainEvent =
  | { type: "DRAG" }
  | { type: "DROP" }
  | { type: "PLACE" };

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
    placing: {},
    close: {},
  },
});
