import { assign, createMachine, Interpreter, State } from "xstate";
import { Client, Room } from "colyseus.js";

import { CONFIG } from "lib/config";
import { OFFLINE_FARM } from "features/game/lib/landData";
import { GameState } from "features/game/types/game";
import { PortalName } from "features/game/types/portals";
import { PlazaRoomState } from "features/world/types/Room";
import { decodeToken } from "features/auth/actions/login";

import { claimArcadeToken } from "../actions/claimArcadeToken";
import { loadPortal } from "../actions/loadPortal";
import { hasReadRules } from "./utils";

const getJWT = () => {
  const code = new URLSearchParams(window.location.search).get("jwt");

  return code;
};

const getServer = () => {
  const code = new URLSearchParams(window.location.search).get("server");

  return code;
};

export interface Context {
  id: number;
  jwt: string;
  state: GameState;
  bumpkinPower: number;
  mmoServer?: Room<PlazaRoomState>;
}

export type PortalEvent =
  | { type: "START" }
  | { type: "CLAIM" }
  | { type: "RETRY" }
  | { type: "CONTINUE" };

export type PortalState = {
  value:
    | "initialising"
    | "error"
    | "idle"
    | "ready"
    | "unauthorised"
    | "loading"
    | "claiming"
    | "completed"
    | "rules";
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
    state: CONFIG.API_URL ? undefined : OFFLINE_FARM,
    completeAcknowledged: false,
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
    introduction: {
      always: [
        { target: "rules", cond: () => !hasReadRules() },
        {
          target: "completed",
          cond: (c) => {
            const todayKey = new Date().toISOString().slice(0, 10);

            const portals = (c.state?.portals ??
              {}) as Required<GameState>["portals"];

            const portal = portals[CONFIG.PORTAL_APP as PortalName];

            const alreadyMintedToday =
              portal?.history[todayKey]?.arcadeTokensMinted ?? 0;

            return alreadyMintedToday > 0;
          },
        },
        {
          target: "ready",
        },
      ],
    },
    loading: {
      id: "loading",
      invoke: {
        src: async (context) => {
          let game;
          let farmId;
          if (!CONFIG.API_URL) {
            game = OFFLINE_FARM;
            farmId = 86;
          } else {
            farmId = decodeToken(context.jwt as string).farmId;
            game = (
              await loadPortal({
                portalId: CONFIG.PORTAL_APP,
                token: context.jwt as string,
              })
            ).game;
          }

          // Join the MMO Server
          let mmoServer: Room<PlazaRoomState> | undefined;
          const serverName = getServer() ?? "main";
          const mmoUrl = CONFIG.ROOM_URL;
          let bumpkinPower = 0;

          if (serverName && mmoUrl) {
            const client = new Client(mmoUrl);

            mmoServer = await client?.joinOrCreate<PlazaRoomState>(serverName, {
              bumpkin: game?.bumpkin,
              farmId,
              experience: game.bumpkin?.experience ?? 0,
            });

            // TODO get power from BE
            bumpkinPower = 100;
          }

          return { game, mmoServer, farmId, bumpkinPower };
        },
        onDone: [
          {
            target: "introduction",
            actions: assign({
              state: (_: any, event) => event.data.game,
              mmoServer: (_: any, event) => event.data.mmoServer,
              bumpkinPower: (_: any, event) => event.data.bumpkinPower,
              id: (_: any, event) => event.data.farmId,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },
    rules: {
      on: {
        CONTINUE: {
          target: "introduction",
        },
      },
    },
    ready: {
      on: {
        CLAIM: {
          target: "claiming",
        },
      },
    },
    claiming: {
      id: "claiming",
      invoke: {
        src: async (context) => {
          const { game } = await claimArcadeToken({
            token: context.jwt as string,
          });

          return { game };
        },
        onDone: [
          {
            target: "completed",
            actions: assign({
              state: (_: any, event) => event.data.game,
            }),
          },
        ],
        onError: [
          {
            target: "error",
          },
        ],
      },
    },
    completed: {
      on: {
        CONTINUE: {
          target: "ready",
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
