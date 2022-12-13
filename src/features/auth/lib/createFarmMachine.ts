import { wallet } from "lib/blockchain/wallet";
import { assign, createMachine, Interpreter } from "xstate";
import { escalate } from "xstate/lib/actions";
import { CharityAddress } from "../components";

export interface Context {
  matic?: number;
  usdc?: number;
}

type PickCharityEvent = {
  type: "PICK_CHARITY";
  charity: CharityAddress;
};

type TickEvent = {
  type: "TICK";
  balance: number;
};

type CreateFarmEvent = {
  type: "CREATE_FARM";
};

export type BlockchainEvent = PickCharityEvent | TickEvent | CreateFarmEvent;

export type CreateFarmMachineState = {
  value: "loading" | "hasEnoughMatic" | "notEnoughMatic";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  CreateFarmMachineState
>;

export const createFarmMachine = createMachine<
  Context,
  BlockchainEvent,
  CreateFarmMachineState
>(
  {
    id: "createFarmMachine",
    initial: "loading",
    context: {},
    states: {
      loading: {
        invoke: {
          src: "loadBalance",
          onDone: [
            {
              target: "hasEnoughMatic",
              cond: (_, event) => event.data.usdc > 5,
              actions: "assignBalance",
            },
            {
              target: "notEnoughMatic",
              actions: "assignBalance",
            },
          ],
          onError: {
            actions: escalate((_, event) => ({
              message: event.data.message,
            })),
          },
        },
      },
      notEnoughMatic: {
        invoke: {
          src: "loadBalance",
          onDone: [
            {
              target: "hasEnoughMatic",
              cond: (_, event) => event.data.usdc > 5,
              actions: "assignBalance",
            },
            {
              actions: "assignBalance",
            },
          ],
          onError: {
            actions: escalate((_, event) => ({
              message: event.data.message,
            })),
          },
        },
        after: {
          1000: "notEnoughMatic",
        },
      },
      hasEnoughMatic: {},
    },
  },
  {
    services: {
      loadBalance: async () => {
        const matic = await wallet.getMaticBalance();
        const usdc = await wallet.getUSDC(matic);
        console.log({ matic, usdc });
        return { matic, usdc };
      },
    },
    actions: {
      assignBalance: assign<Context, any>({
        matic: (_, event) => event.data.matic,
        usdc: (_, event) => event.data.usdc,
      }),
    },
  }
);
