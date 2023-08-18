import { Room, Client } from "colyseus.js";

import { assign, createMachine, Interpreter, State } from "xstate";
import { PlazaRoomState } from "./types/Room";

import { CONFIG } from "lib/config";
import { Bumpkin } from "features/game/types/game";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { SPAWNS } from "./lib/spawn";

export type Scenes = {
  plaza: Room<PlazaRoomState> | undefined;
  auction_house: Room<PlazaRoomState> | undefined;
  clothes_shop: Room<PlazaRoomState> | undefined;
  decorations_shop: Room<PlazaRoomState> | undefined;
  windmill_floor: Room<PlazaRoomState> | undefined;
  igor_home: Room<PlazaRoomState> | undefined;
  bert_home: Room<PlazaRoomState> | undefined;
  timmy_home: Room<PlazaRoomState> | undefined;
  betty_home: Room<PlazaRoomState> | undefined;
  woodlands: Room<PlazaRoomState> | undefined;
  dawn_breaker: Room<PlazaRoomState> | undefined;
  marcus_home: Room<PlazaRoomState> | undefined;
  corn_maze: Room<PlazaRoomState> | undefined;
};
export type SceneId = keyof Scenes;

export type ServerId =
  | "sunflorea_bliss"
  | "sunflorea_dream"
  | "sunflorea_oasis"
  | "sunflorea_brazil"
  | "sunflorea_magic";

type ServerName = "Bliss" | "Dream" | "Oasis" | "Brazil" | "Magic";

export type Server = {
  name: ServerName;
  id: ServerId;
  population: number;
};
const SERVERS: Server[] = [
  { name: "Bliss", id: "sunflorea_bliss", population: 0 },
  { name: "Dream", id: "sunflorea_dream", population: 0 },
  { name: "Oasis", id: "sunflorea_oasis", population: 0 },
  { name: "Brazil", id: "sunflorea_brazil", population: 0 },
  // { name: "Magic", id: "sunflorea_magic", population: 0 },
];

export interface MMOContext {
  jwt: string;
  farmId: number;
  bumpkin: Bumpkin;
  client?: Client;
  availableServers: Server[];
  server?: Room<PlazaRoomState> | undefined;
  serverId: ServerId;
  initialSceneId: SceneId;
  experience: number;
  isCommunity?: boolean;
}

export type MMOState = {
  value:
    | "error"
    | "initialising"
    | "introduction"
    | "connecting"
    | "connected"
    | "kicked"
    | "reconnecting";
  context: MMOContext;
};

export type PickServer = {
  type: "PICK_SERVER";
  serverId: ServerId;
};

export type MMOEvent =
  | PickServer
  | { type: "CONTINUE" }
  | { type: "DISCONNECTED" }
  | { type: "RETRY" };

export type MachineState = State<MMOContext, MMOEvent, MMOState>;

export type MachineInterpreter = Interpreter<
  MMOContext,
  any,
  MMOEvent,
  any,
  any
>;

export const mmoMachine = createMachine<MMOContext, MMOEvent, MMOState>({
  initial: "initialising",
  context: {
    jwt: "",
    farmId: 0,
    bumpkin: INITIAL_BUMPKIN,
    availableServers: SERVERS,
    serverId: "sunflorea_bliss",
    initialSceneId: "plaza",
    experience: 0,
    isCommunity: false,
  },
  exit: (context) => context.server?.leave(),
  states: {
    initialising: {
      always: [
        {
          target: "connecting",
        },
      ],
    },
    connecting: {
      invoke: {
        id: "connecting",
        src: (context, event) => async () => {
          const url = (event as any).url || CONFIG.ROOM_URL;
          if (!url) {
            return { roomId: undefined };
          }

          // Server connection is too fast
          await new Promise((res) => setTimeout(res, 1000));

          const client = new Client(url);

          const available = await client?.getAvailableRooms();

          // Iterate through the available rooms and update the server population
          const servers = context.availableServers.map((server) => {
            const colyseusRoom = available?.find(
              (room) => room.name === server.id
            );
            const population = colyseusRoom?.clients ?? 0;
            return { ...server, population };
          });

          console.log({ servers });
          return { client, servers };
        },
        onDone: [
          {
            target: "joined",
            cond: (_) => !CONFIG.ROOM_URL,
          },
          {
            target: "joining",
            cond: (context) => !!context.isCommunity,
            // Community always uses bliss
            actions: assign({
              serverId: (_, event) => "sunflorea_bliss",
            }),
          },
          {
            target: "connected",
            actions: assign({
              client: (_, event) => event.data.client,
              availableServers: (_, event) => event.data.servers,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    connected: {
      on: {
        PICK_SERVER: {
          target: "joining",
          actions: assign({
            serverId: (_, event) => event.serverId,
          }),
        },
      },
    },
    joining: {
      invoke: {
        id: "joining",
        src: (context, event) => async () => {
          await new Promise((r) => setTimeout(r, 1000));

          // Join server based on what was selected
          const server = await context.client?.joinOrCreate<PlazaRoomState>(
            context.serverId,
            {
              jwt: context.jwt,
              bumpkin: context.bumpkin,
              farmId: context.farmId,
              x: SPAWNS.plaza.default.x,
              y: SPAWNS.plaza.default.y,
              sceneId: context.initialSceneId,
              experience: context.experience,
            }
          );

          return { server };
        },
        onDone: [
          {
            target: "joined",
            actions: assign({
              server: (_, event) => event.data.server,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    joined: {
      always: [
        {
          target: "introduction",
          cond: () => !localStorage.getItem("mmo_introduction.read"),
        },
      ],
    },
    introduction: {
      on: {
        CONTINUE: {
          target: "joined",
          actions: () =>
            localStorage.setItem(
              "mmo_introduction.read",
              Date.now().toString()
            ),
        },
      },
    },

    kicked: {},
    reconnecting: {},
    error: {
      on: {
        RETRY: {
          target: "reconnecting",
        },
      },
    },
  },
});

/**
 * Simple bus to send MMO events from game
 */
class MMOBus {
  private listener?: (message: any) => void;

  public send(message: any) {
    console.log({ message });
    if (this.listener) {
      this.listener(message);
    }
  }

  public listen(cb: (message: any) => void) {
    this.listener = cb;
  }
}

export const mmoBus = new MMOBus();
