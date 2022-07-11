import { assign, createMachine, Interpreter } from "xstate";

interface Context {
  visitingFarmId?: number;
}

type BlockchainEvent = { type: "VISIT"; farmId: number };

type BlockchainState = { value: "idle"; context: Context };

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export const buyingMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>(
  {
    initial: "idle",
    states: {
      idle: {
        on: {
          VISIT: {
            target: "idle",
            actions: assign((_, event) => ({
              visitingFarmId: event.farmId,
            })),
          },
        },
      },
    },
  },
  {}
);
