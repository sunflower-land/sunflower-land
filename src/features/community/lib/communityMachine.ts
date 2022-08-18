import { createMachine, Interpreter, assign } from "xstate";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import Decimal from "decimal.js-light";
import { metamask } from "lib/blockchain/metamask";
import { fromWei } from "web3-utils";

export interface Context {
  balance: Decimal;
}

export type CommmunityMachineState = {
  value: "loading" | "idle" | "error";
  context: Context;
};

export type StateKeys = keyof Omit<CommmunityMachineState, "context">;
export type StateValues = CommmunityMachineState[StateKeys];

export type MachineInterpreter = Interpreter<
  Context,
  any,
  any,
  CommmunityMachineState
>;

export function startCommunityMachine(authContext: AuthContext) {
  return createMachine<Context, any, CommmunityMachineState>({
    id: "communityMachine",
    initial: "loading",
    context: {
      balance: new Decimal(0),
    },
    states: {
      loading: {
        invoke: {
          src: async () => {
            // TODO load on chain balances for current wallet

            const balance = await metamask
              .getToken()
              .balanceOf(metamask.myAccount as string);
            return {
              balance: new Decimal(fromWei(balance)),
            };
          },
          onDone: {
            target: "idle",
            actions: assign({
              balance: (_, event) => event.data.balance,
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      idle: {},
      error: {},
    },
  });
}
