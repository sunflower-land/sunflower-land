import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { createMachine, assign, Interpreter } from "xstate";
import { getOnChainState, isFarmBlacklisted } from "../actions/onchain";
import { GameState } from "../types/game";
import { EMPTY } from "./constants";
export interface Context {
  state: GameState;
  farmId?: number;
  address?: string;
  owner?: string;
  isBlacklisted?: boolean;
  errorCode?: keyof typeof ERRORS;
}

type State = {
  value: "loading" | "blacklisted" | "visiting" | "error";
  context: Context;
};

type Event =
  | {
      type: "VISIT_NEW_FARM";
    }
  | {
      type: "CHAIN_CHANGED";
    }
  | {
      type: "ACCOUNT_CHANGED";
    }
  | {
      type: "REFRESH";
    }
  | {
      type: "CONTINUE";
    };

export type StateKeys = keyof Omit<State, "context">;
export type MachineInterpreter = Interpreter<Context, any, Event, State>;
export type StateValues = State[StateKeys];

const setFarmDetails = assign<Context, any>({
  farmId: (_context, event) => event.data.farmId,
  address: (_context, event) => event.data.address,
  isBlacklisted: (_context, event) => event.data.isBlacklisted,
  owner: (_context, event) => event.data.owner,
  state: (_, event) => event.data.state,
});

const API_URL = CONFIG.API_URL;

export function startGame({ farmToVisitID }: { farmToVisitID: number }) {
  return createMachine<Context, Event, State>(
    {
      id: "visitingMachine",
      context: { state: EMPTY, isBlacklisted: undefined },
      // Allow a development playground if there is now API_URL env variable
      initial: API_URL ? "loading" : "visiting",
      states: {
        loading: {
          invoke: {
            src: "loadFarmToVisit",
            onDone: [
              {
                target: "blacklisted",
                cond: (_, event) => !!event.data.isBlacklisted,
                actions: setFarmDetails,
              },
              {
                target: "visiting",
                actions: setFarmDetails,
              },
            ],
            onError: {
              target: "error",
            },
          },
        },
        blacklisted: {
          on: {
            CONTINUE: {
              target: "visiting",
            },
          },
        },
        visiting: {},
        error: {},
      },
    },
    {
      services: {
        loadFarmToVisit: async (): Promise<Context | undefined> => {
          const farmAccount = await metamask.getFarm()?.getFarm(farmToVisitID);

          const { game: onChain, owner } = await getOnChainState({
            farmAddress: farmAccount.account,
            id: farmToVisitID,
          });

          const isBlacklisted = await isFarmBlacklisted(farmToVisitID);

          return {
            farmId: farmAccount.tokenId,
            address: farmAccount.account,
            owner,
            isBlacklisted,
            state: { id: farmToVisitID, ...onChain },
          };
        },
      },
      actions: {
        assignErrorMessage: assign<Context, any>({
          errorCode: (_context, event) => event.data.message,
        }),
        assignIsBlacklisted: assign<Context, any>({
          isBlacklisted: (_context, event) => event.data.isBlacklisted,
        }),
      },
    }
  );
}
