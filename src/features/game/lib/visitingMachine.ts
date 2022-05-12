import { metamask } from "lib/blockchain/metamask";
import { createMachine, assign, Interpreter } from "xstate";
import { getOnChainState, isFarmBlacklisted } from "../actions/onchain";
import { GameState } from "../types/game";
import { EMPTY } from "./constants";

export interface Context {
  state: GameState;
  farmId?: number;
  address?: string;
  isBlacklisted?: boolean;
}

type State = {
  value:
    | "loading"
    | "checkFarm"
    | "blacklisted"
    | "visiting"
    | "leaving"
    | "error";
  context: Context;
};

type Event =
  | {
      type: "BACK";
    }
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
  state: (_, event) => event.data.state,
});

// const getFarmIdFromUrl = () => {
//   const paths = window.location.href.split("/visit/");
//   const id = paths[paths.length - 1];

//   return parseInt(id);
// };

export function startGame({ farmId }: { farmId: number }) {
  return createMachine<Context, Event, State>({
    id: "visitingMachine",
    context: { state: EMPTY, isBlacklisted: undefined },
    initial: "loading",
    states: {
      loading: {
        invoke: {
          src: async (): Promise<any | undefined> => {
            const farmAccount = await metamask.getFarm()?.getFarm(farmId);

            console.log({ farmAccount });
            console.log({ farmId });

            const { game: onChain } = await getOnChainState({
              farmAddress: farmAccount.account,
              id: farmId,
            });

            console.log({ onChain });

            const isBlacklisted = await isFarmBlacklisted(farmId);

            const test = {
              farmId: farmAccount.tokenId,
              address: farmAccount.account,
              isBlacklisted,
              state: { id: farmId, ...onChain },
            };

            console.log({ test });

            return test;
          },
          onDone: [
            {
              target: "blacklisted",
              cond: (context) => !!context.isBlacklisted,
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
      checkFarm: {
        invoke: {
          src: "visitFarm",
          onDone: [
            {
              target: "blacklisted",
              cond: (context: Context) => !!context.isBlacklisted,
              actions: assign<Context, any>({
                isBlacklisted: (_context, event) => event.data.isBlacklisted,
              }),
            },
            {
              target: "visiting",
              actions: "assignFarm",
              cond: () => true,
            },
          ],
          onError: {
            target: "error",
            actions: "assignErrorMessage",
          },
        },
      },
      blacklisted: {
        on: {
          CONTINUE: "leaving",
        },
      },
      visiting: {
        on: {
          BACK: {
            target: "leaving",
          },
        },
      },
      leaving: {
        entry: () => (window.location.href = "https://sunflower-land.com/play"),
        type: "final",
      },
      error: {
        entry: () => console.log("there was an error"),
      },
    },
  });
}
