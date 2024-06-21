import { OFFLINE_FARM } from "features/game/lib/landData";
import { GameState } from "features/game/types/game";
import { assign, createMachine, Interpreter, State } from "xstate";
import { getUrl, loadPortal } from "../../actions/loadPortal";
import { CONFIG } from "lib/config";
import { decodeToken } from "features/auth/actions/login";

const getJWT = () => {
  const code = new URLSearchParams(window.location.search).get("jwt");
  return code;
};

export interface Context {
  id: number;
  jwt: string;
  state: GameState;
}

export type PortalEvent = { type: "PURCHASED" } | { type: "RETRY" };

export type PortalState = {
  value: "initialising" | "error" | "unauthorised" | "loading" | "playing";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  PortalEvent,
  PortalState
>;

export type PortalMachineState = State<Context, PortalEvent, PortalState>;

export const portalMachine = createMachine({
  id: "festivalOfColorsMachine",
  initial: "initialising",
  context: {
    id: 0,
    jwt: getJWT(),
    state: CONFIG.API_URL ? undefined : OFFLINE_FARM,
  },
  states: {
    initialising: {
      always: [
        {
          target: "unauthorised",
          // TODO: Also validate token
          cond: (context) => !!CONFIG.API_URL && !context.jwt,
        },
        {
          target: "loading",
        },
      ],
    },

    loading: {
      id: "loading",
      invoke: {
        src: async (context) => {
          if (!getUrl()) {
            return {
              game: OFFLINE_FARM,
            };
          }

          const { farmId } = decodeToken(context.jwt as string);

          // Load the game data
          const { game } = await loadPortal({
            portalId: CONFIG.PORTAL_APP,
            token: context.jwt as string,
          });

          return { game, farmId };
        },
        onDone: [
          {
            target: "playing",
            actions: assign({
              state: (_: any, event) => event.data.game,
              id: (_: any, event) => event.data.farmId,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    playing: {
      on: {
        PURCHASED: {
          actions: [
            () => {
              // Put your logic once purchase is complete
              alert("Thank you for purchasing!");
            },
          ],
        },
      },
    },

    error: {
      on: {
        RETRY: {
          target: "initialising",
        },
      },
    },
    unauthorised: {},
  },
});
