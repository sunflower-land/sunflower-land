import { createMachine, Interpreter, assign } from "xstate";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import Decimal from "decimal.js-light";
import { wallet } from "lib/blockchain/wallet";
import { fromWei } from "web3-utils";
import { getOnChainState } from "features/game/actions/onchain";
import { loadSession } from "features/game/actions/loadSession";
import { Bumpkin } from "features/game/types/game";

export interface Context {
  balance: Decimal;
  farmId: number;
  migrated: boolean;
  bumpkin?: Bumpkin;
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
      farmId: 0,
      migrated: false,
    },
    states: {
      loading: {
        invoke: {
          src: async () => {
            const balance = await wallet
              .getToken()
              .balanceOf(wallet.myAccount as string);

            const farmId = authContext.farmId as number;

            const onChainStateFn = await getOnChainState({
              farmAddress: authContext.address as string,
              id: Number(authContext.farmId),
            });
            const sessionIdFn = wallet.getSessionManager().getSessionId(farmId);
            const [onChainState, sessionId] = await Promise.all([
              onChainStateFn,
              sessionIdFn,
            ]);

            const response = await loadSession({
              farmId,
              sessionId,
              token: authContext.rawToken as string,
              bumpkinTokenUri: onChainState.bumpkin?.tokenURI,
            });

            return {
              balance: new Decimal(fromWei(balance)),
              farmId,
              migrated: authContext.migrated,
              bumpkin: response?.game.bumpkin,
            };
          },
          onDone: {
            target: "idle",
            actions: assign({
              balance: (_, event) => event.data.balance,
              farmId: (_, event) => event.data.farmId,
              migrated: (_, event) => event.data.migrated,
              bumpkin: (_, event) => event.data.bumpkin,
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
