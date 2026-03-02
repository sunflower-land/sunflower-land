import { OFFLINE_FARM } from "features/game/lib/landData";
import { GameState } from "features/game/types/game";
import {
  assign,
  createMachine,
  fromPromise,
  ActorRefFrom,
  SnapshotFrom,
} from "xstate";
import { getJwt, getUrl, loadPortal } from "../../actions/loadPortal";
import { CONFIG } from "lib/config";
import { decodeToken } from "features/auth/actions/login";

export interface Context {
  id: number;
  jwt: string;
  state: GameState | undefined;
}

export type PortalEvent = { type: "PURCHASED" } | { type: "RETRY" };

export type PortalState = {
  value: "initialising" | "error" | "unauthorised" | "loading" | "playing";
  context: Context;
};

export const portalMachine = createMachine({
  id: "festivalOfColorsMachine",
  types: {} as { context: Context; events: PortalEvent },
  initial: "initialising",
  context: {
    id: 0,
    jwt: getJwt(),
    state: CONFIG.API_URL ? undefined : OFFLINE_FARM,
  },
  states: {
    initialising: {
      always: [
        {
          target: "unauthorised",
          // TODO: Also validate token
          guard: ({ context }) => !!CONFIG.API_URL && !context.jwt,
        },
        {
          target: "loading",
        },
      ],
    },

    loading: {
      id: "loading",
      invoke: {
        src: fromPromise(async ({ input }) => {
          if (!getUrl()) {
            return {
              game: OFFLINE_FARM,
            };
          }

          const { farmId } = decodeToken(input.jwt as string);

          // Load the game data
          const { game } = await loadPortal({
            portalId: CONFIG.PORTAL_APP,
            token: input.jwt as string,
          });

          return { game, farmId };
        }),
        input: ({ context }) => context,
        onDone: [
          {
            target: "playing",
            actions: assign({
              state: ({ event }) => (event as any).output.game,
              id: ({ event }) => (event as any).output.farmId,
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

export type MachineInterpreter = ActorRefFrom<typeof portalMachine>;

export type PortalMachineState = SnapshotFrom<typeof portalMachine>;
