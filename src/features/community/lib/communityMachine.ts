import { createMachine, Interpreter, assign } from "xstate";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import Decimal from "decimal.js-light";
import { wallet } from "lib/blockchain/wallet";
import { fromWei } from "web3-utils";
import { getOnChainState } from "features/game/actions/onchain";
import { loadSession } from "features/game/actions/loadSession";
import { Bumpkin } from "features/game/types/game";
import { randomID } from "lib/utils/random";
import { getSessionId } from "lib/blockchain/Sessions";
import { sflBalanceOf } from "lib/blockchain/Token";

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

export function startCommunityMachine(authContext: AuthContext) {
  return createMachine<Context, any, CommmunityMachineState>(
    {
      id: "communityMachine",
      initial: "loading",
      context: {
        balance: new Decimal(0),
        farmId: 0,
      },
      states: {
        loading: {
          entry: "setTransactionId",
          invoke: {
            src: async (context) => {
              const balance = await sflBalanceOf(
                wallet.web3Provider,
                wallet.myAccount,
                wallet.myAccount as string
              );

              const farmId = authContext.farmId as number;

              const onChainStateFn = await getOnChainState({
                farmAddress: authContext.address as string,
                id: Number(authContext.farmId),
              });
              const sessionIdFn = getSessionId(
                wallet.web3Provider,
                wallet.myAccount,
                farmId
              );
              const [onChainState, sessionId] = await Promise.all([
                onChainStateFn,
                sessionIdFn,
              ]);

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
