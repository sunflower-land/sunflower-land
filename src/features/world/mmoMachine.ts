import { Room, Client } from "colyseus.js";

import {
  assign,
  createMachine,
  fromPromise,
  fromCallback,
  ActorRefFrom,
  SnapshotFrom,
} from "xstate";
import { PlazaRoomState } from "./types/Room";

import { CONFIG } from "lib/config";
import { Bumpkin, FactionName, IslandType } from "features/game/types/game";
import { Pets } from "features/game/types/pets";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { SPAWNS } from "./lib/spawn";
import { Moderation } from "features/game/lib/gameMachine";
import { MAX_PLAYERS } from "./lib/availableRooms";
import { NPCName } from "lib/npcs";
import { Coordinates } from "features/game/expansion/components/MapPlacement";

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
  stream: Room<PlazaRoomState> | undefined;
  love_island: Room<PlazaRoomState> | undefined;
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
  | "sunflorea_magic"
  | "sunflorea_kale"
  | "sunflorea_flower"
  | "sunflorea_stream";

export type ServerName =
  | "Bliss"
  | "Dream"
  | "Oasis"
  | "Brazil"
  | "Magic"
  | "Kale"
  | "Flower"
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
  {
    name: "Magic",
    id: "sunflorea_magic",
    population: 0,
    purpose: "Chill & Chat",
  },
  {
    name: "Kale",
    id: "sunflorea_kale",
    population: 0,
    purpose: "Chill & Chat",
  },
  {
    name: "Flower",
    id: "sunflorea_flower",
    population: 0,
    purpose: "Chill & Chat",
  },
];

export interface MMOContext {
  username?: string;
  jwt: string;
  farmId: number;
  bumpkin: Bumpkin;
  pets?: Pets;
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
  totalDeliveries: number;
  dailyStreak: number;
  isVip: boolean;
  createdAt: number;
  islandType: IslandType;
  playerCoordinates?: Coordinates;
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
  previousSceneId?: SceneId;
  playerCoordinates: {
    x: number;
    y: number;
  };
};

export type MMOEvent =
  | PickServer
  | { type: "CONTINUE"; username?: string }
  | { type: "DISCONNECTED" }
  | { type: "RETRY" }
  | { type: "CHANGE_SERVER"; serverId: ServerId }
  | ConnectEvent
  | SwitchScene;

export const mmoMachine = createMachine({
  types: {} as {
    context: MMOContext;
    events: MMOEvent;
  },
  initial: "initialising",
  context: {
    jwt: "",
    farmId: 0,
    bumpkin: INITIAL_BUMPKIN,
    username: "",
    availableServers: SERVERS,
    serverId: "sunflorea_bliss" as ServerId,
    sceneId: "plaza" as SceneId,
    previousSceneId: null,
    experience: 0,
    isCommunity: false,
    totalDeliveries: 0,
    dailyStreak: 0,
    isVip: false,
    createdAt: 0,
    islandType: "basic" as IslandType,
    moderation: {
      kicked: [],
      muted: [],
    },
    playerCoordinates: undefined,
  },
  states: {
    initialising: {
      always: [
        {
          target: "idle",
          guard: ({ context }) => !!context.isCommunity,
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
        src: fromPromise(
          async ({
            input,
          }: {
            input: {
              url: string | undefined;
              server: Room<PlazaRoomState> | undefined;
              availableServers: Server[];
              sceneId: SceneId;
            };
          }) => {
            const url = input.url || CONFIG.ROOM_URL;
            if (!url) {
              return { roomId: undefined };
            }

            if (input.server) {
              input.server.leave();
            }

            const client = new Client(url);

            const available = await client?.getAvailableRooms();

            const servers = input.availableServers.map((server) => {
              const colyseusRoom = available?.find(
                (room) => room.name === server.id,
              );
              const population = colyseusRoom?.clients ?? 0;
              return { ...server, population };
            });

            if (input.sceneId === "stream") {
              const streamClient = new Client(url);
              return {
                client: streamClient,
                serverId: "sunflorea_stream" as ServerId,
                servers,
              };
            }

            const server = pickServer(servers);

            return { client, servers, serverId: server };
          },
        ),
        input: ({ context, event }) => ({
          url: (event as any).url as string | undefined,
          server: context.server,
          availableServers: context.availableServers,
          sceneId: context.sceneId,
        }),
        onDone: [
          {
            target: "joined",
            guard: () => !CONFIG.ROOM_URL,
          },
          {
            target: "joining",
            guard: ({ event }) => (event as any).output.serverId,
            actions: assign({
              client: ({ event }) => (event as any).output.client,
              availableServers: ({ event }) => (event as any).output.servers,
              serverId: ({ event }) => (event as any).output.serverId,
            }),
          },
          {
            target: "connected",
            actions: assign({
              client: ({ event }) => (event as any).output.client,
              availableServers: ({ event }) => (event as any).output.servers,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    exploring: {
      invoke: {
        id: "exploring",
        src: fromPromise(
          async ({
            input,
          }: {
            input: {
              url: string;
              serverId: string;
              jwt: string;
              bumpkin: Bumpkin;
              farmId: number;
              sceneId: SceneId;
              experience: number;
              moderation: Moderation;
              username?: string;
              faction?: FactionName;
              totalDeliveries: number;
              dailyStreak: number;
              isVip: boolean;
              createdAt: number;
              islandType: IslandType;
            };
          }) => {
            const client = new Client(input.url);

            const server = await client?.joinOrCreate<PlazaRoomState>(
              input.serverId,
              {
                jwt: input.jwt,
                bumpkin: input.bumpkin,
                farmId: input.farmId,
                x: SPAWNS().plaza.default.x,
                y: SPAWNS().plaza.default.y,
                sceneId: input.sceneId,
                experience: input.experience,
                moderation: input.moderation,
                username: input.username,
                faction: input.faction,
                totalDeliveries: input.totalDeliveries,
                dailyStreak: input.dailyStreak,
                isVip: input.isVip,
                createdAt: input.createdAt,
                islandType: input.islandType,
              },
            );

            return { server, client, serverId: input.serverId };
          },
        ),
        input: ({ context, event }) => ({
          url: (event as ConnectEvent).url,
          serverId: (event as ConnectEvent).serverId,
          jwt: context.jwt,
          bumpkin: context.bumpkin,
          farmId: context.farmId,
          sceneId: context.sceneId,
          experience: context.experience,
          moderation: context.moderation,
          username: context.username,
          faction: context.faction,
          totalDeliveries: context.totalDeliveries,
          dailyStreak: context.dailyStreak,
          isVip: context.isVip,
          createdAt: context.createdAt,
          islandType: context.islandType,
        }),
        onDone: [
          {
            target: "joined",
            actions: assign({
              server: ({ event }) => (event as any).output.server,
              client: ({ event }) => (event as any).output.client,
              serverId: ({ event }) => (event as any).output.serverId,
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
              serverId: ({ event }) => (event as PickServer).serverId,
            }),
            ({ event }) => saveDefaultServer((event as PickServer).serverId),
          ],
        },
      },
    },
    joining: {
      invoke: {
        id: "joining",
        src: fromPromise(
          async ({
            input,
          }: {
            input: {
              client?: Client;
              serverId: ServerId;
              jwt: string;
              bumpkin: Bumpkin;
              pets?: Pets;
              farmId: number;
              username?: string;
              faction?: FactionName;
              sceneId: SceneId;
              experience: number;
              moderation: Moderation;
              totalDeliveries: number;
              dailyStreak: number;
              isVip: boolean;
              createdAt: number;
              islandType: IslandType;
            };
          }) => {
            const server = await input.client?.joinOrCreate<PlazaRoomState>(
              input.serverId,
              {
                jwt: input.jwt,
                bumpkin: input.bumpkin,
                pets: input.pets,
                farmId: input.farmId,
                username: input.username,
                faction: input.faction,
                x: SPAWNS().plaza.default.x,
                y: SPAWNS().plaza.default.y,
                sceneId: input.sceneId,
                experience: input.experience,
                moderation: input.moderation,
                totalDeliveries: input.totalDeliveries,
                dailyStreak: input.dailyStreak,
                isVip: input.isVip,
                createdAt: input.createdAt,
                islandType: input.islandType,
              },
            );

            return { server };
          },
        ),
        input: ({ context }) => ({
          client: context.client,
          serverId: context.serverId,
          jwt: context.jwt,
          bumpkin: context.bumpkin,
          pets: context.pets,
          farmId: context.farmId,
          username: context.username,
          faction: context.faction,
          sceneId: context.sceneId,
          experience: context.experience,
          moderation: context.moderation,
          totalDeliveries: context.totalDeliveries,
          dailyStreak: context.dailyStreak,
          isVip: context.isVip,
          createdAt: context.createdAt,
          islandType: context.islandType,
        }),
        onDone: [
          {
            target: "joined",
            actions: assign({
              server: ({ event }) => (event as any).output.server,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },
    joined: {
      invoke: {
        src: fromCallback(
          ({
            sendBack,
            input,
          }: {
            sendBack: (event: { type: string }) => void;
            input: { server?: Room<PlazaRoomState> };
          }) => {
            input.server?.onLeave(() => {
              sendBack({ type: "DISCONNECTED" });
            });
          },
        ),
        input: ({ context }) => ({ server: context.server }),
      },
      always: [
        { target: "introduction", guard: ({ context }) => !context.username },
      ],
      on: {
        CHANGE_SERVER: {
          target: "connecting",
          actions: [
            assign({
              serverId: ({ event }) =>
                (event as { type: "CHANGE_SERVER"; serverId: ServerId })
                  .serverId,
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
              username: ({ event }) =>
                (event as { type: "CONTINUE"; username?: string }).username,
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
    SWITCH_SCENE: [
      {
        // If coming or going from stream scene, we need to reload the server
        guard: ({ context, event }) => {
          return (
            context.sceneId === "stream" ||
            (event as SwitchScene).sceneId === "stream"
          );
        },
        actions: [
          assign({
            sceneId: ({ event }) => (event as SwitchScene).sceneId,
            previousSceneId: ({ context, event }) =>
              (event as SwitchScene).previousSceneId ?? context.previousSceneId,
            playerCoordinates: ({ event }) =>
              (event as SwitchScene).playerCoordinates,
          }),
          ({ context, event }) =>
            context.server?.send(0, {
              sceneId: (event as SwitchScene).sceneId,
              x: (event as SwitchScene).playerCoordinates.x,
              y: (event as SwitchScene).playerCoordinates.y,
            }),
        ],
        // If going into or leaving stream scene, we need to reload the server
        target: "connecting",
      },
      {
        actions: [
          assign({
            sceneId: ({ event }) => (event as SwitchScene).sceneId,
            previousSceneId: ({ context, event }) =>
              (event as SwitchScene).previousSceneId ?? context.previousSceneId,
            playerCoordinates: ({ event }) =>
              (event as SwitchScene).playerCoordinates,
          }),
          ({ context, event }) =>
            context.server?.send(0, {
              sceneId: (event as SwitchScene).sceneId,
              x: (event as SwitchScene).playerCoordinates.x,
              y: (event as SwitchScene).playerCoordinates.y,
            }),
        ],
        // TODO: If going into or leaving stream scene, we need to reload the server
        target: "joined",
      },
    ],
  },
});

export type MachineState = SnapshotFrom<typeof mmoMachine>;

export type MachineInterpreter = ActorRefFrom<typeof mmoMachine>;

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
