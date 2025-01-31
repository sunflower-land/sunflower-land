import { Room, Client } from "colyseus.js";

import { assign, createMachine, Interpreter, State } from "xstate";
import { PlazaRoomState } from "./types/Room";

import { CONFIG } from "lib/config";
import { Bumpkin, FactionName } from "features/game/types/game";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { SPAWNS } from "./lib/spawn";
import { Moderation } from "features/game/lib/gameMachine";
import { MAX_PLAYERS } from "./lib/availableRooms";
import { NPCName } from "lib/npcs";

export type Scenes = {
  plaza: Room<PlazaRoomState> | undefined;
  auction_house: Room<PlazaRoomState> | undefined;
  clothes_shop: Room<PlazaRoomState> | undefined;
  decorations_shop: Room<PlazaRoomState> | undefined;
  windmill_floor: Room<PlazaRoomState> | undefined;
  woodlands: Room<PlazaRoomState> | undefined;
  beach: Room<PlazaRoomState> | undefined;
  crop_boom: Room<PlazaRoomState> | undefined;
  mushroom_forest: Room<PlazaRoomState> | undefined;
  retreat: Room<PlazaRoomState> | undefined;
  kingdom: Room<PlazaRoomState> | undefined;
  faction_house: Room<PlazaRoomState> | undefined;
  goblin_house: Room<PlazaRoomState> | undefined;
  sunflorian_house: Room<PlazaRoomState> | undefined;
  nightshade_house: Room<PlazaRoomState> | undefined;
  bumpkin_house: Room<PlazaRoomState> | undefined;
  portal_example: Room<PlazaRoomState> | undefined;
  infernos: Room<PlazaRoomState> | undefined;
};

export type SceneId = keyof Scenes;

export function getDefaultServer(): ServerId | undefined {
  return localStorage.getItem("mmo_server") as ServerId | undefined;
}

export function saveDefaultServer(serverId: ServerId) {
  localStorage.setItem("mmo_server", serverId);
}

function pickServer(servers: Server[]) {
  const defaultServer = getDefaultServer();

  if (defaultServer) {
    const server = servers.find((server) => server.id === defaultServer);
    if (server && server.population < MAX_PLAYERS) {
      return server.id;
    }
  }

  // They don't have a default - pick the first available
  const available = servers.filter((server) => server.population < MAX_PLAYERS);

  if (available.length > 0) {
    return available[0].id;
  }

  return undefined;
}

export type ServerId =
  | "sunflorea_bliss"
  | "sunflorea_dream"
  | "sunflorea_oasis"
  | "sunflorea_brazil"
  | "sunflorea_magic";

export type ServerName =
  | "Bliss"
  | "Dream"
  | "Oasis"
  | "Brazil"
  | "Magic"
  | "Bumpkin Bazaar";
export type ServerPurpose = "Chill & Chat" | "Trading";

export type Server = {
  name: ServerName;
  id: ServerId;
  population: number;
  purpose: ServerPurpose;
};
const SERVERS: Server[] = [
  {
    name: "Bumpkin Bazaar",
    id: "sunflorea_oasis",
    population: 0,
    purpose: "Trading",
  },
  {
    name: "Bliss",
    id: "sunflorea_bliss",
    population: 0,
    purpose: "Chill & Chat",
  },
  {
    name: "Dream",
    id: "sunflorea_dream",
    population: 0,
    purpose: "Chill & Chat",
  },
  {
    name: "Brazil",
    id: "sunflorea_brazil",
    population: 0,
    purpose: "Chill & Chat",
  },
  // { name: "Magic", id: "sunflorea_magic", population: 0 },
];

export interface MMOContext {
  username?: string;
  jwt: string;
  farmId: number;
  bumpkin: Bumpkin;
  client?: Client;
  faction?: FactionName;
  availableServers: Server[];
  server?: Room<PlazaRoomState> | undefined;
  serverId: ServerId;
  sceneId: SceneId;
  previousSceneId: SceneId | null;
  experience: number;
  isCommunity?: boolean;
  firstDeliveryNpc?: NPCName;
  moderation: Moderation;
}

export type MMOState = {
  value:
    | "error"
    | "initialising"
    | "introduction"
    | "connecting"
    | "connected"
    | "kicked"
    | "reconnecting"
    | "exploring"; // Community island
  context: MMOContext;
};

export type PickServer = {
  type: "PICK_SERVER";
  serverId: ServerId;
};

export type ConnectEvent = {
  type: "CONNECT";
  url: string;
  serverId: string;
};

export type SwitchScene = {
  type: "SWITCH_SCENE";
  sceneId: SceneId;
};

export type UpdatePreviousScene = {
  type: "UPDATE_PREVIOUS_SCENE";
  previousSceneId: SceneId;
};

export type MMOEvent =
  | PickServer
  | { type: "CONTINUE"; username?: string }
  | { type: "DISCONNECTED" }
  | { type: "RETRY" }
  | { type: "CHANGE_SERVER"; serverId: ServerId }
  | ConnectEvent
  | SwitchScene
  | UpdatePreviousScene;

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
    username: "",
    availableServers: SERVERS,
    serverId: "sunflorea_bliss",
    sceneId: "plaza",
    previousSceneId: null,
    experience: 0,
    isCommunity: false,
    moderation: {
      kicked: [],
      muted: [],
    },
  },
  exit: (context) => context.server?.leave(),
  states: {
    initialising: {
      always: [
        {
          target: "idle",
          cond: (context) => !!context.isCommunity,
        },
        {
          target: "connecting",
        },
      ],
    },
    idle: {
      on: {
        CONNECT: "exploring",
      },
    },
    connecting: {
      invoke: {
        id: "connecting",
        src: (context, event) => async () => {
          const url = (event as any).url || CONFIG.ROOM_URL;
          if (!url) {
            return { roomId: undefined };
          }

          // In case it's a server switch - leave the current server and wipe context data for the new one
          if (context.server) {
            context.server.leave();
            context.server = undefined;
          }

          const client = new Client(url);
          const available = await client?.getAvailableRooms();

          // Iterate through the available rooms and update the server population
          const servers = context.availableServers.map((server) => {
            const colyseusRoom = available?.find(
              (room) => room.name === server.id,
            );
            const population = colyseusRoom?.clients ?? 0;
            return { ...server, population };
          });

          const server = pickServer(servers);

          return { client, servers, serverId: server };
        },
        onDone: [
          {
            target: "joined",
            cond: (_) => !CONFIG.ROOM_URL,
          },
          // Try automatically join server
          {
            target: "joining",
            cond: (_, event) => event.data.serverId,
            actions: assign({
              client: (_, event) => event.data.client,
              availableServers: (_, event) => event.data.servers,
              serverId: (_, event) => event.data.serverId,
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

    // Connect to URL and room in same call (community island)
    exploring: {
      invoke: {
        id: "exploring",
        src: (context, event) => async () => {
          const { url, serverId } = event as ConnectEvent;

          const client = new Client(url);

          // Join server based on what was selected
          const server = await client?.joinOrCreate<PlazaRoomState>(serverId, {
            jwt: context.jwt,
            bumpkin: context.bumpkin,
            farmId: context.farmId,
            x: SPAWNS().plaza.default.x,
            y: SPAWNS().plaza.default.y,
            sceneId: context.sceneId,
            experience: context.experience,
            moderation: context.moderation,
            username: context.username,
            faction: context.faction,
          });

          return { server, client, serverId };
        },
        onDone: [
          {
            target: "joined",
            actions: assign({
              server: (_, event) => event.data.server,
              client: (_, event) => event.data.client,
              serverId: (_, event) => event.data.serverId,
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
          actions: [
            assign({
              serverId: (_, event) => event.serverId,
            }),
            (_, event) => saveDefaultServer(event.serverId),
          ],
        },
      },
    },
    joining: {
      invoke: {
        id: "joining",
        src: (context, event) => async (send) => {
          // Join server based on what was selected
          const server = await context.client?.joinOrCreate<PlazaRoomState>(
            context.serverId,
            {
              jwt: context.jwt,
              bumpkin: context.bumpkin,
              farmId: context.farmId,
              username: context.username,
              faction: context.faction,
              x: SPAWNS().plaza.default.x,
              y: SPAWNS().plaza.default.y,
              sceneId: context.sceneId,
              experience: context.experience,
              moderation: context.moderation,
            },
          );

          server?.onLeave((client) => {
            send("DISCONNECTED");
          });

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
          cond: (context) =>
            !localStorage.getItem("mmo_introduction.read") || !context.username,
        },
      ],
      on: {
        CHANGE_SERVER: {
          target: "connecting",
          actions: [
            assign({
              serverId: (_, event) => event.serverId,
            }),
          ],
        },
        DISCONNECTED: {
          target: "error",
        },
      },
    },
    introduction: {
      on: {
        CONTINUE: {
          target: "joined",
          actions: [
            () => {
              localStorage.setItem(
                "mmo_introduction.read",
                Date.now().toString(),
              );
            },
            assign({
              username: (_, event) => event.username,
            }),
          ],
        },
      },
    },
    kicked: {},
    reconnecting: {
      always: [
        {
          target: "connecting",
        },
      ],
    },
    error: {
      on: {
        RETRY: {
          target: "reconnecting",
        },
      },
    },
  },
  on: {
    SWITCH_SCENE: {
      actions: [
        assign({
          sceneId: (_, event) => event.sceneId,
        }),
        (context, event) => context.server?.send(0, { sceneId: event.sceneId }),
      ],
    },
    UPDATE_PREVIOUS_SCENE: {
      actions: assign({
        previousSceneId: (_, event) => event.previousSceneId,
      }),
    },
  },
});

/**
 * Fetch available Plaza servers
 * @returns {Promise<Server[]>} Available servers
 * @export fetchAvailableServers
 * @async
 */
export async function fetchAvailableServers(): Promise<Server[]> {
  const client = new Client(CONFIG.ROOM_URL);
  const available = await client.getAvailableRooms();

  // Iterate through the available rooms and update the server population
  return SERVERS.map((server) => {
    const colyseusRoom = available.find((room) => room.name === server.id);
    const population = colyseusRoom?.clients ?? 0;
    return { ...server, population };
  });
}

/**
 * Simple bus to send MMO events from game
 */
class MMOBus {
  private listener?: (message: any) => void;

  public send(message: any) {
    if (this.listener) {
      this.listener(message);
    }
  }

  public listen(cb: (message: any) => void) {
    this.listener = cb;
  }
}

export const mmoBus = new MMOBus();
