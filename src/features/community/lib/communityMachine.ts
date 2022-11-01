import { createMachine, Interpreter, assign } from "xstate";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import Decimal from "decimal.js-light";
import { fromWei } from "web3-utils";
import { CONFIG } from "lib/config";

export interface Context {
  balance: Decimal;
  farmId: number;
  bumpkin?: Bumpkin;
  transactionId?: string;
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

const API_URL = CONFIG.API_URL;

export function startCommunityMachine(authContext: AuthContext) {
  return createMachine<Context, any, CommmunityMachineState>(
    {
      id: "communityMachine",
      initial: API_URL ? "loading" : "idle",
      context: {
        balance: new Decimal(0),
        farmId: 0,
      },
      states: {
        loading: {
          invoke: {
            src: async () => {
              // TODO load on chain balances for current wallet

              const balance = await metamask
                .getToken()
                .balanceOf(metamask.myAccount as string);

              const response = await loadSession({
                farmId,
                sessionId,
                token: authContext.rawToken as string,
                bumpkinTokenUri: onChainState.bumpkin?.tokenURI,
                transactionId: context.transactionId as string,
              });

              return {
                balance: new Decimal(fromWei(balance)),
                farmId,
                bumpkin: response?.game.bumpkin,
              };
            },
            onDone: {
              target: "idle",
              actions: assign({
                balance: (_, event) => event.data.balance,
                farmId: (_, event) => event.data.farmId,
                bumpkin: (_, event) => event.data.bumpkin,
              }),
            },
            onError: {
              target: "error",
            },
          },
        },
        idle: {
          entry: "clearTransactionId",
        },
        error: {},
      },
    },
    {
      actions: {
        setTransactionId: assign<Context, any>({
          transactionId: () => randomID(),
        }),
        clearTransactionId: assign<Context, any>({
          transactionId: () => undefined,
        }),
      },
    }
  );
}
