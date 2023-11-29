import { OFFLINE_FARM } from "features/game/lib/landData";
import { GameState } from "features/game/types/game";
import { createMachine, Interpreter, State } from "xstate";

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
  value: "initialising" | "idle" | "ready" | "unauthorised" | "loading";
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
          // Validate token
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
          // Grab ID from token
          // await new Promise((r) => setTimeout(r, 2000));
          // Load game state
        },
        onDone: [
          {
            target: "idle",
          },
        ],
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
  },
});
