import { OFFLINE_FARM } from "features/game/lib/landData";
import { GameState } from "features/game/types/game";
import { assign, createMachine, Interpreter, State } from "xstate";
import { loadPortal } from "./actions/loadPortal";
import { CONFIG } from "lib/config";

const getJWT = () => {
  const code = new URLSearchParams(window.location.search).get("jwt");

  return code;
};

export interface Context {
  id: number;
  jwt: string;
  state: GameState;
}

export type PortalEvent = { type: "START" };

export type PortalState = {
  value:
    | "initialising"
    | "error"
    | "idle"
    | "ready"
    | "unauthorised"
    | "loading";
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
  id: "portalMachine",
  initial: "initialising",
  context: {
    id: 0,
    jwt: getJWT(),
    state: OFFLINE_FARM,
  },
  states: {
    initialising: {
      always: [
        {
          target: "unauthorised",
          // TODO: Also validate token
          cond: (context) => !context.jwt,
        },
        {
          target: "loading",
        },
      ],
    },
    unauthorised: {},
    loading: {
      id: "loading",
      invoke: {
        src: async (context) => {
          const player = await loadPortal({
            portalId: CONFIG.PORTAL_APP,
            token: context.jwt as string,
          });

          return player;
        },
        onDone: [
          {
            target: "idle",
            actions: assign({
              state: (_: any, event) => event.data.game,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },
    idle: {
      on: {
        START: {
          target: "ready",
        },
      },
    },
    ready: {},
    error: {},
  },
});
